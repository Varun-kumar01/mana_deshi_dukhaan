import { query, isPgActive, mockDbStore } from '../config/db.js';

export async function checkPincode(req, res) {
  try {
    const { pincode } = req.params;

    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit pincode' });
    }

    let record = null;
    if (isPgActive()) {
      const result = await query(
        `SELECT * FROM delivery_pincodes WHERE pincode = $1 AND is_active = true`,
        [pincode]
      );
      if (result.rows.length > 0) {
        record = result.rows[0];
      }
    } else {
      record = mockDbStore.delivery_pincodes.find(p => p.pincode === pincode);
    }

    if (record) {
      return res.json({
        success: true,
        available: true,
        is_local_express: record.zone === 'Hyderabad Express',
        zone: record.zone,
        area_name: record.area_name,
        delivery_time_estimate: record.delivery_time_estimate,
        delivery_fee: parseFloat(record.delivery_fee),
        free_delivery_above: parseFloat(record.free_delivery_above),
        message: `Delivery available to ${record.area_name}! Estimated time: ${record.delivery_time_estimate}`
      });
    }

    // Fallback for general Hyderabad/Telangana (500xxx) or Pan India
    if (pincode.startsWith('500')) {
      return res.json({
        success: true,
        available: true,
        is_local_express: false,
        zone: 'Hyderabad Standard',
        area_name: 'Hyderabad / Secunderabad',
        delivery_time_estimate: 'Same Day / Next Day',
        delivery_fee: 45.00,
        free_delivery_above: 599.00,
        message: 'Standard Hyderabad delivery available! Estimated time: 24-48 hours.'
      });
    }

    // Pan India standard courier
    return res.json({
      success: true,
      available: true,
      is_local_express: false,
      zone: 'Pan India Courier',
      area_name: 'Domestic Shipping',
      delivery_time_estimate: '3-5 Working Days',
      delivery_fee: 70.00,
      free_delivery_above: 999.00,
      message: 'Pan-India shipping available via speed courier! Estimated time: 3-5 days.'
    });
  } catch (error) {
    console.error('Error checking pincode:', error);
    res.status(500).json({ success: false, message: 'Server error checking pincode' });
  }
}

export async function getAllPincodes(req, res) {
  try {
    if (isPgActive()) {
      const result = await query(`SELECT * FROM delivery_pincodes WHERE is_active = true ORDER BY pincode ASC`);
      return res.json({ success: true, data: result.rows });
    }
    return res.json({ success: true, data: mockDbStore.delivery_pincodes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching pincodes' });
  }
}

export default { checkPincode, getAllPincodes };
