import { query, isPgActive, mockDbStore } from '../config/db.js';

// Get all products with search, category, and sorting filters
export async function getProducts(req, res) {
  try {
    const { category, search, featured, bestseller, new_arrival, sort } = req.query;

    if (isPgActive()) {
      let sql = `
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               json_agg(DISTINCT v.*) FILTER (WHERE v.id IS NOT NULL) as variants,
               json_agg(DISTINCT img.image_url) FILTER (WHERE img.id IS NOT NULL) as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants v ON p.id = v.product_id
        LEFT JOIN product_images img ON p.id = img.product_id
        WHERE 1=1
      `;
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        sql += ` AND (c.slug = $${params.length} OR p.category_id::text = $${params.length})`;
      }

      if (search) {
        params.push(`%${search}%`);
        sql += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length} OR p.tagline ILIKE $${params.length})`;
      }

      if (featured === 'true') {
        sql += ` AND p.is_featured = true`;
      }
      if (bestseller === 'true') {
        sql += ` AND p.is_bestseller = true`;
      }
      if (new_arrival === 'true') {
        sql += ` AND p.is_new_arrival = true`;
      }

      sql += ` GROUP BY p.id, c.name, c.slug`;

      if (sort === 'price_asc') {
        sql += ` ORDER BY p.base_price ASC`;
      } else if (sort === 'price_desc') {
        sql += ` ORDER BY p.base_price DESC`;
      } else if (sort === 'rating') {
        sql += ` ORDER BY p.rating DESC, p.review_count DESC`;
      } else {
        sql += ` ORDER BY p.is_bestseller DESC, p.created_at DESC`;
      }

      const result = await query(sql, params);
      return res.json({ success: true, count: result.rows.length, data: result.rows });
    }

    // Mock store filter
    let items = [...mockDbStore.products];

    if (category && category !== 'all') {
      const cat = mockDbStore.categories.find(c => c.slug === category || String(c.id) === category);
      if (cat) {
        items = items.filter(p => p.category_id === cat.id);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      items = items.filter(p => p.is_featured);
    }
    if (bestseller === 'true') {
      items = items.filter(p => p.is_bestseller);
    }
    if (new_arrival === 'true') {
      items = items.filter(p => p.is_new_arrival);
    }

    if (sort === 'price_asc') {
      items.sort((a, b) => a.base_price - b.base_price);
    } else if (sort === 'price_desc') {
      items.sort((a, b) => b.base_price - a.base_price);
    } else if (sort === 'rating') {
      items.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    // Attach category name
    const enriched = items.map(p => {
      const cat = mockDbStore.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : 'General',
        category_slug: cat ? cat.slug : 'general',
      };
    });

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
}

// Get single product by slug or id
export async function getProduct(req, res) {
  try {
    const { identifier } = req.params;

    if (isPgActive()) {
      const isNum = !isNaN(identifier);
      const sql = `
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               json_agg(DISTINCT v.*) FILTER (WHERE v.id IS NOT NULL) as variants,
               json_agg(DISTINCT img.image_url) FILTER (WHERE img.id IS NOT NULL) as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants v ON p.id = v.product_id
        LEFT JOIN product_images img ON p.id = img.product_id
        WHERE ${isNum ? 'p.id = $1' : 'p.slug = $1'}
        GROUP BY p.id, c.name, c.slug
      `;
      const result = await query(sql, [isNum ? parseInt(identifier) : identifier]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const product = result.rows[0];

      // Fetch related products
      const relatedRes = await query(
        `SELECT id, name, slug, base_price, compare_at_price, rating, review_count, is_bestseller
         FROM products WHERE category_id = $1 AND id != $2 LIMIT 4`,
        [product.category_id, product.id]
      );
      product.related = relatedRes.rows;

      return res.json({ success: true, data: product });
    }

    // Mock store
    const isNum = !isNaN(identifier);
    const product = mockDbStore.products.find(p => isNum ? p.id === parseInt(identifier) : p.slug === identifier);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cat = mockDbStore.categories.find(c => c.id === product.category_id);
    const related = mockDbStore.products
      .filter(p => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 4);

    return res.json({
      success: true,
      data: {
        ...product,
        category_name: cat ? cat.name : 'General',
        category_slug: cat ? cat.slug : 'general',
        related
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error fetching product' });
  }
}

// Admin: Create product
export async function createProduct(req, res) {
  try {
    const {
      name, category_id, base_price, compare_at_price, tagline, short_description,
      description, ingredients, benefits, how_to_use, shelf_life, storage_instructions,
      is_featured, is_bestseller, is_new_arrival, variants, images
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const newId = Date.now();

    const productRecord = {
      id: newId,
      name,
      slug,
      category_id: parseInt(category_id) || 1,
      base_price: parseFloat(base_price),
      compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
      tagline: tagline || '',
      short_description: short_description || '',
      description: description || '',
      ingredients: ingredients || '',
      benefits: benefits || '',
      how_to_use: how_to_use || '',
      shelf_life: shelf_life || '6 Months',
      storage_instructions: storage_instructions || 'Store in cool, dry place.',
      is_featured: !!is_featured,
      is_bestseller: !!is_bestseller,
      is_new_arrival: !!is_new_arrival,
      is_organic_certified: true,
      rating: 5.0,
      review_count: 0,
      variants: variants && variants.length > 0 ? variants.map((v, i) => ({
        id: newId + i + 1,
        title: v.title || 'Standard',
        weight_value: v.weight_value || 500,
        weight_unit: v.weight_unit || 'g',
        price: parseFloat(v.price) || parseFloat(base_price),
        compare_price: v.compare_price ? parseFloat(v.compare_price) : null,
        stock_quantity: v.stock_quantity || 50
      })) : [
        { id: newId + 1, title: '500g', weight_value: 500, weight_unit: 'g', price: parseFloat(base_price), stock_quantity: 50 }
      ],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80']
    };

    mockDbStore.products.unshift(productRecord);

    if (isPgActive()) {
      await query(
        `INSERT INTO products (id, name, slug, category_id, base_price, compare_at_price, tagline, short_description, description, ingredients, benefits, how_to_use, shelf_life, storage_instructions, is_featured, is_bestseller, is_new_arrival)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          productRecord.id, productRecord.name, productRecord.slug, productRecord.category_id,
          productRecord.base_price, productRecord.compare_at_price, productRecord.tagline,
          productRecord.short_description, productRecord.description, productRecord.ingredients,
          productRecord.benefits, productRecord.how_to_use, productRecord.shelf_life,
          productRecord.storage_instructions, productRecord.is_featured, productRecord.is_bestseller,
          productRecord.is_new_arrival
        ]
      );
    }

    res.status(201).json({ success: true, message: 'Product created successfully', data: productRecord });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
}

// Admin: Update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const numId = parseInt(id);

    const index = mockDbStore.products.findIndex(p => p.id === numId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    mockDbStore.products[index] = { ...mockDbStore.products[index], ...updates };

    if (isPgActive()) {
      if (updates.name && updates.base_price) {
        await query(
          `UPDATE products SET name = $1, base_price = $2, compare_at_price = $3, is_bestseller = $4, is_featured = $5 WHERE id = $6`,
          [updates.name, updates.base_price, updates.compare_at_price, updates.is_bestseller, updates.is_featured, numId]
        );
      }
    }

    res.json({ success: true, message: 'Product updated successfully', data: mockDbStore.products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
}

// Admin: Delete product
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const numId = parseInt(id);

    mockDbStore.products = mockDbStore.products.filter(p => p.id !== numId);

    if (isPgActive()) {
      await query(`DELETE FROM products WHERE id = $1`, [numId]);
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
}

// Admin: Bulk upload products (CSV / JSON)
export async function bulkUploadProducts(req, res) {
  try {
    const { products: incomingList } = req.body;
    if (!Array.isArray(incomingList) || incomingList.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty product list provided' });
    }

    const createdList = [];

    for (const item of incomingList) {
      if (!item.name || !item.base_price) continue;

      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
      const newId = Date.now() + Math.floor(Math.random() * 1000);

      const productRecord = {
        id: newId,
        name: item.name,
        slug,
        category_id: parseInt(item.category_id) || 1,
        base_price: parseFloat(item.base_price),
        compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
        tagline: item.tagline || '',
        short_description: item.short_description || '',
        description: item.description || '',
        ingredients: item.ingredients || '',
        benefits: item.benefits || '',
        how_to_use: item.how_to_use || '',
        shelf_life: item.shelf_life || '6 Months',
        storage_instructions: item.storage_instructions || 'Store in cool dry place.',
        is_featured: !!item.is_featured,
        is_bestseller: !!item.is_bestseller,
        is_new_arrival: true,
        is_organic_certified: true,
        rating: 5.0,
        review_count: 0,
        variants: item.variants && item.variants.length > 0 ? item.variants.map((v, i) => ({
          id: newId + i + 1,
          title: v.title || 'Standard',
          weight_value: v.weight_value || 500,
          weight_unit: v.weight_unit || 'g',
          price: parseFloat(v.price) || parseFloat(item.base_price),
          stock_quantity: parseInt(v.stock_quantity) || 50
        })) : [
          { id: newId + 1, title: '250g', price: parseFloat(item.base_price), stock_quantity: 50 },
          { id: newId + 2, title: '500g', price: parseFloat(item.base_price) * 1.9, stock_quantity: 40 },
          { id: newId + 3, title: '1kg', price: parseFloat(item.base_price) * 3.6, stock_quantity: 25 }
        ],
        images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80']
      };

      mockDbStore.products.unshift(productRecord);
      createdList.push(productRecord);
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${createdList.length} products to inventory!`,
      count: createdList.length,
      data: createdList
    });
  } catch (error) {
    console.error('Error during bulk product upload:', error);
    res.status(500).json({ success: false, message: 'Server error during bulk upload' });
  }
}

// Admin: Get all inventory & stock status
export async function getInventory(req, res) {
  try {
    const inventoryItems = [];

    mockDbStore.products.forEach(p => {
      const cat = mockDbStore.categories.find(c => c.id === p.category_id);
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          inventoryItems.push({
            productId: p.id,
            productName: p.name,
            categoryName: cat ? cat.name : 'Pantry',
            variantId: v.id,
            variantTitle: v.title,
            price: v.price,
            stockQuantity: v.stock_quantity ?? 50,
            isLowStock: (v.stock_quantity ?? 50) < 15,
            sku: `MD-${p.slug.slice(0, 4).toUpperCase()}-${v.title.replace(/[^a-zA-Z0-9]/g, '')}`
          });
        });
      } else {
        inventoryItems.push({
          productId: p.id,
          productName: p.name,
          categoryName: cat ? cat.name : 'Pantry',
          variantId: p.id,
          variantTitle: 'Standard',
          price: p.base_price,
          stockQuantity: 50,
          isLowStock: false,
          sku: `MD-${p.slug.slice(0, 4).toUpperCase()}-STD`
        });
      }
    });

    res.json({
      success: true,
      count: inventoryItems.length,
      data: inventoryItems
    });
  } catch (error) {
    console.error('Error getting inventory:', error);
    res.status(500).json({ success: false, message: 'Server error fetching inventory' });
  }
}

// Admin: Update variant stock
export async function updateVariantStock(req, res) {
  try {
    const { variantId } = req.params;
    const { stock_quantity } = req.body;
    const vId = parseInt(variantId);

    let updated = false;

    for (const p of mockDbStore.products) {
      if (p.variants) {
        const v = p.variants.find(v => v.id === vId);
        if (v) {
          v.stock_quantity = parseInt(stock_quantity);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    res.json({ success: true, message: 'Stock updated successfully', stock_quantity });
  } catch (error) {
    console.error('Error updating variant stock:', error);
    res.status(500).json({ success: false, message: 'Server error updating stock' });
  }
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getInventory,
  updateVariantStock
};

