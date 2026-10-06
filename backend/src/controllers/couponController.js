import { query, isPgActive, mockDbStore } from '../config/db.js';

export async function validateCoupon(req, res) {
  try {
    const { code, order_amount } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const amount = parseFloat(order_amount || 0);

    let coupon = null;

    if (isPgActive()) {
      const result = await query(
        `SELECT * FROM coupons WHERE code = $1 AND is_active = true`,
        [cleanCode]
      );
      if (result.rows.length > 0) {
        coupon = result.rows[0];
      }
    } else {
      coupon = mockDbStore.coupons.find(c => c.code.toUpperCase() === cleanCode);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (amount < parseFloat(coupon.min_order_amount)) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires minimum order of ₹${coupon.min_order_amount}`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, parseFloat(coupon.max_discount_amount));
      }
    } else {
      discount = parseFloat(coupon.discount_value);
    }

    discount = Math.min(discount, amount);

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        discount: Math.round(discount),
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ success: false, message: 'Server error validating coupon' });
  }
}

export async function getCoupons(req, res) {
  try {
    if (isPgActive()) {
      const result = await query(`SELECT * FROM coupons WHERE is_active = true ORDER BY id ASC`);
      return res.json({ success: true, data: result.rows });
    }
    return res.json({ success: true, data: mockDbStore.coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching coupons' });
  }
}

export default { validateCoupon, getCoupons };
