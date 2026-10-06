import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'manadeshi_dukaan',
  connectionTimeoutMillis: 3000,
};

let pool = null;
let isPostgresConnected = false;

// Fallback in-memory store if PostgreSQL is not active/available yet
export const mockDbStore = {
  categories: [],
  products: [],
  product_variants: [],
  product_images: [],
  coupons: [],
  delivery_pincodes: [],
  orders: [],
  order_items: [],
  reviews: [],
  users: [],
};

// Initialize connection
export async function initDb() {
  try {
    console.log('🔄 Attempting PostgreSQL connection to:', dbConfig.database, 'at', dbConfig.host);
    pool = new Pool(dbConfig);
    
    // Test query
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL successfully at:', res.rows[0].now);
    isPostgresConnected = true;

    // Run schema
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ PostgreSQL Schema initialized successfully');
    }
    return true;
  } catch (err) {
    console.warn('⚠️  PostgreSQL connection failed:', err.message);
    console.warn('💡 ManaDeshi Dukaan is running in zero-setup Local Storage mode.');
    console.warn('👉 To connect to PostgreSQL: configure DATABASE_URL or PGPASSWORD in backend/.env');
    isPostgresConnected = false;
    return false;
  }
}

// Universal query runner supporting both PostgreSQL and in-memory mock store
export async function query(text, params = []) {
  if (isPostgresConnected && pool) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('PostgreSQL query error:', err.message, 'SQL:', text);
      throw err;
    }
  }

  // Fallback simulator for common queries
  return executeMockQuery(text, params);
}

// Safe helper for mock query execution
function executeMockQuery(sql, params) {
  const normalized = sql.trim().toLowerCase();

  // Simple handlers for common queries
  if (normalized.startsWith('select') && normalized.includes('from categories')) {
    return { rows: [...mockDbStore.categories] };
  }

  if (normalized.startsWith('select') && normalized.includes('from products')) {
    return { rows: [...mockDbStore.products] };
  }

  if (normalized.startsWith('select') && normalized.includes('from delivery_pincodes')) {
    return { rows: [...mockDbStore.delivery_pincodes] };
  }

  if (normalized.startsWith('select') && normalized.includes('from coupons')) {
    return { rows: [...mockDbStore.coupons] };
  }

  if (normalized.startsWith('select') && normalized.includes('from orders')) {
    return { rows: [...mockDbStore.orders] };
  }

  return { rows: [] };
}

export function isPgActive() {
  return isPostgresConnected;
}

export default {
  query,
  initDb,
  isPgActive,
  mockDbStore
};
