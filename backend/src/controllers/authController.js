import { query, isPgActive, mockDbStore } from '../config/db.js';

// Pre-seeded users for immediate login / demo
export const seededUsers = [
  {
    id: 1,
    name: 'Swathi (Store Admin)',
    email: 'admin@manadeshi.com',
    phone: '+91 9951118687',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Ravi Teja',
    email: 'customer@gmail.com',
    phone: '+91 9849012345',
    password: 'customer123',
    role: 'customer'
  }
];

// Initialize users in mockDbStore
if (!mockDbStore.users || mockDbStore.users.length === 0) {
  mockDbStore.users = [...seededUsers];
}

export async function login(req, res) {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Check in mockDbStore first or PostgreSQL
    let user = mockDbStore.users.find(u => 
      (u.email && u.email.toLowerCase() === cleanInput) || 
      (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, ''))
    );

    if (isPgActive() && !user) {
      const result = await query(
        `SELECT id, name, email, phone, role, password_hash FROM users WHERE LOWER(email) = $1 OR phone = $1`,
        [cleanInput]
      );
      if (result.rows.length > 0) {
        user = result.rows[0];
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Please register or check credentials.' });
    }

    // Verify password (plain for demo seed or hashed)
    if (user.password !== password && user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Safe user object (remove password)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const token = 'manadeshi_jwt_token_' + Buffer.from(JSON.stringify(safeUser)).toString('base64');

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

export async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone, and password are required' });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPhone = phone.trim();

    // Check if user already exists
    const exists = mockDbStore.users.some(u => 
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) || 
      (u.phone && u.phone === cleanPhone)
    );

    if (exists) {
      return res.status(400).json({ success: false, message: 'An account with this email or phone already exists' });
    }

    const newId = Date.now();
    const newUser = {
      id: newId,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: 'customer',
      created_at: new Date().toISOString()
    };

    mockDbStore.users.push(newUser);

    if (isPgActive()) {
      await query(
        `INSERT INTO users (id, name, email, phone, password_hash, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newUser.id, newUser.name, newUser.email, newUser.phone, newUser.password, newUser.role]
      );
    }

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };

    const token = 'manadeshi_jwt_token_' + Buffer.from(JSON.stringify(safeUser)).toString('base64');

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ManaDeshi Dukaan.',
      user: safeUser,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
}

export async function getMe(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const encoded = token.replace('manadeshi_jwt_token_', '');
    const user = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));

    return res.json({ success: true, user });
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
}

export default { login, register, getMe, seededUsers };
