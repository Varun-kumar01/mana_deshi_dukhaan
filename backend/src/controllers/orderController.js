import { query, isPgActive, mockDbStore } from '../config/db.js';

// Create a new order
export async function createOrder(req, res) {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      items,
      subtotal,
      discount_amount = 0,
      delivery_fee = 0,
      total_amount,
      coupon_code,
      payment_method = 'COD',
      special_instructions,
      user_id
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    // Generate Order Number
    const orderNumber = 'MD-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = Date.now();

    const newOrder = {
      id: orderId,
      order_number: orderNumber,
      customer_name,
      customer_phone,
      customer_email: customer_email || '',
      delivery_address,
      delivery_zone: delivery_address.pincode === '500089' ? 'Manikonda Express' : 'Hyderabad Express',
      subtotal: parseFloat(subtotal),
      discount_amount: parseFloat(discount_amount || 0),
      delivery_fee: parseFloat(delivery_fee || 0),
      total_amount: parseFloat(total_amount),
      coupon_code: coupon_code || null,
      payment_method,
      payment_status: payment_method === 'Razorpay' || payment_method === 'UPI' ? 'Paid' : 'Pending',
      order_status: 'Confirmed',
      special_instructions: special_instructions || '',
      whatsapp_order_sent: true,
      items: items.map((item, idx) => ({
        id: orderId + idx + 1,
        product_id: item.product_id,
        product_name: item.name || item.product_name,
        variant_title: item.variant_title || 'Standard',
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        subtotal: parseFloat(item.price) * parseInt(item.quantity, 10),
        product_image: item.image || item.product_image || ''
      })),
      created_at: new Date().toISOString(),
      user_id: user_id || null
    };

    // Store in mockStore
    mockDbStore.orders.unshift(newOrder);

    // If PostgreSQL active, insert to PG
    if (isPgActive()) {
      const orderRes = await query(
        `INSERT INTO orders (
           order_number, customer_name, customer_phone, customer_email,
           delivery_address, delivery_zone, subtotal, discount_amount, delivery_fee,
           total_amount, coupon_code, payment_method, payment_status, order_status,
           special_instructions
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING id`,
        [
          newOrder.order_number, newOrder.customer_name, newOrder.customer_phone,
          newOrder.customer_email, JSON.stringify(newOrder.delivery_address),
          newOrder.delivery_zone, newOrder.subtotal, newOrder.discount_amount,
          newOrder.delivery_fee, newOrder.total_amount, newOrder.coupon_code,
          newOrder.payment_method, newOrder.payment_status, newOrder.order_status,
          newOrder.special_instructions
        ]
      );

      const pgOrderId = orderRes.rows[0].id;
      for (const it of newOrder.items) {
        await query(
          `INSERT INTO order_items (order_id, product_id, product_name, variant_title, price, quantity, subtotal, product_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [pgOrderId, it.product_id, it.product_name, it.variant_title, it.price, it.quantity, it.subtotal, it.product_image]
        );
      }
    }

    // Format WhatsApp message text
    const storeWhatsApp = '919951118687';
    const itemsText = newOrder.items.map(i => `• ${i.product_name} (${i.variant_title}) x ${i.quantity} = ₹${i.subtotal}`).join('%0A');
    const addressText = `${delivery_address.flat_house}, ${delivery_address.street_area}, Hyderabad - ${delivery_address.pincode}`;
    const waText = `*MANADESHI DUKAAN - NEW ORDER ${orderNumber}*%0A%0A` +
      `*Customer:* ${customer_name}%0A` +
      `*Phone:* ${customer_phone}%0A` +
      `*Address:* ${encodeURIComponent(addressText)}%0A%0A` +
      `*Items:*%0A${itemsText}%0A%0A` +
      `*Total Amount:* ₹${newOrder.total_amount}%0A` +
      `*Payment:* ${payment_method} (${newOrder.payment_status})%0A%0A` +
      `Please confirm my delivery!`;

    const whatsappUrl = `https://wa.me/${storeWhatsApp}?text=${waText}`;

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
      whatsappUrl
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
}

// Get order by Order Number or ID
export async function getOrder(req, res) {
  try {
    const { identifier } = req.params;

    if (isPgActive()) {
      const isNum = !isNaN(identifier) && identifier.length < 9;
      const sql = `
        SELECT o.*,
               json_agg(DISTINCT oi.*) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE ${isNum ? 'o.id = $1' : 'o.order_number = $1'}
        GROUP BY o.id
      `;
      const result = await query(sql, [isNum ? parseInt(identifier) : identifier]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.json({ success: true, data: result.rows[0] });
    }

    // Mock store
    const order = mockDbStore.orders.find(o =>
      o.order_number === identifier || String(o.id) === identifier
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error fetching order' });
  }
}

// Get all orders (for Admin or customer)
export async function getAllOrders(req, res) {
  try {
    const { status, limit = 50 } = req.query;

    if (isPgActive()) {
      let sql = `
        SELECT o.*,
               json_agg(DISTINCT oi.*) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE 1=1
      `;
      const params = [];

      if (status && status !== 'all') {
        params.push(status);
        sql += ` AND o.order_status = $${params.length}`;
      }

      sql += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${parseInt(limit)}`;
      const result = await query(sql, params);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    let orders = [...mockDbStore.orders];
    if (status && status !== 'all') {
      orders = orders.filter(o => o.order_status.toLowerCase() === status.toLowerCase());
    }

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
}

// Update order status (Admin)
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = mockDbStore.orders.find(o => String(o.id) === id || o.order_number === id);
    if (order) {
      order.order_status = status;
      order.updated_at = new Date().toISOString();
    }

    if (isPgActive()) {
      await query(
        `UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id::text = $2 OR order_number = $2`,
        [status, id]
      );
    }

    res.json({ success: true, message: `Order status updated to ${status}`, status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
}

export default {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus
};
