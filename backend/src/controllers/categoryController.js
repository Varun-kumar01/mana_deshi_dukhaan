import { query, isPgActive, mockDbStore } from '../config/db.js';

export async function getCategories(req, res) {
  try {
    if (isPgActive()) {
      const result = await query(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.display_order ASC
      `);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    // Mock store
    const categoriesWithCount = mockDbStore.categories.map(c => {
      const count = mockDbStore.products.filter(p => p.category_id === c.id).length;
      return { ...c, product_count: count };
    });

    return res.json({ success: true, count: categoriesWithCount.length, data: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
}

export default { getCategories };
