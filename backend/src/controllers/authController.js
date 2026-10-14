import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  query,
  isPgActive,
  mockDbStore,
} from '../config/db.js';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'manadeshi-dukaan-development-secret-change-in-production';

const JWT_EXPIRES_IN = '7d';

/*
 * Demo users for local/no-database mode.
 *
 * These users are only used when PostgreSQL is unavailable.
 */
export const seededUsers = [
  {
    id: 1,
    name: 'Swathi (Store Admin)',
    email: 'admin@manadeshi.com',
    phone: '+91 9951118687',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Ravi Teja',
    email: 'customer@gmail.com',
    phone: '+91 9849012345',
    password: 'customer123',
    role: 'customer',
  },
];

if (!mockDbStore.users || mockDbStore.users.length === 0) {
  mockDbStore.users = [...seededUsers];
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function cleanUser(user) {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'customer',
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email || '',
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
}

async function verifyPassword(password, user) {
  if (!password) return false;

  /*
   * New PostgreSQL accounts use bcrypt.
   */
  if (user.password_hash) {
    if (
      String(user.password_hash).startsWith('$2')
    ) {
      return bcrypt.compare(
        password,
        user.password_hash,
      );
    }

    /*
     * Compatibility with old demo records that may
     * still contain plaintext passwords.
     */
    return user.password_hash === password;
  }

  /*
   * In-memory demo users.
   */
  return user.password === password;
}

export async function login(req, res) {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide your email/phone and password.',
      });
    }

    const identifier = String(emailOrPhone).trim();

    const email = normalizeEmail(identifier);
    const phone = normalizePhone(identifier);

    let user = null;

    /*
     * PostgreSQL is the source of truth when available.
     */
    if (isPgActive()) {
      const result = await query(
        `
        SELECT
          id,
          name,
          email,
          phone,
          role,
          password_hash
        FROM users
        WHERE
          LOWER(COALESCE(email, '')) = $1
          OR regexp_replace(
            COALESCE(phone, ''),
            '[^0-9]',
            '',
            'g'
          ) = $2
        LIMIT 1
        `,
        [email, phone],
      );

      if (result.rows.length > 0) {
        user = result.rows[0];
      }
    }

    /*
     * Fallback/demo mode.
     */
    if (!user) {
      user = mockDbStore.users.find(
        (candidate) => {
          const candidateEmail =
            normalizeEmail(candidate.email);

          const candidatePhone =
            normalizePhone(candidate.phone);

          return (
            (email &&
              candidateEmail &&
              candidateEmail === email) ||
            (phone &&
              candidatePhone &&
              candidatePhone === phone)
          );
        },
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          'No account found with those details.',
      });
    }

    const passwordValid =
      await verifyPassword(password, user);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message:
          'Incorrect password. Please try again.',
      });
    }

    const safeUser = cleanUser(user);
    const token = createToken(safeUser);

    return res.json({
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message:
        'Server error while signing you in.',
    });
  }
}

export async function register(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const cleanName = String(name || '').trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPhone = String(phone || '').trim();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name.',
      });
    }

    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your phone number.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least 6 characters.',
      });
    }

    const normalizedPhone =
      normalizePhone(cleanPhone);

    /*
     * Check PostgreSQL first.
     */
    if (isPgActive()) {
      const existing = await query(
        `
        SELECT id
        FROM users
        WHERE
          (
            $1 <> ''
            AND LOWER(COALESCE(email, '')) = $1
          )
          OR regexp_replace(
            COALESCE(phone, ''),
            '[^0-9]',
            '',
            'g'
          ) = $2
        LIMIT 1
        `,
        [cleanEmail, normalizedPhone],
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            'An account with this email or phone already exists.',
        });
      }

      const passwordHash =
        await bcrypt.hash(password, 12);

      const result = await query(
        `
        INSERT INTO users (
          name,
          email,
          phone,
          password_hash,
          role
        )
        VALUES ($1, $2, $3, $4, 'customer')
        RETURNING
          id,
          name,
          email,
          phone,
          role
        `,
        [
          cleanName,
          cleanEmail || null,
          cleanPhone,
          passwordHash,
        ],
      );

      const safeUser = cleanUser(
        result.rows[0],
      );

      const token = createToken(safeUser);

      return res.status(201).json({
        success: true,
        message:
          'Account created successfully! Welcome to ManaDeshi Dukaan.',
        user: safeUser,
        token,
      });
    }

    /*
     * Local fallback mode.
     */
    const existingMockUser =
      mockDbStore.users.find((candidate) => {
        const candidateEmail =
          normalizeEmail(candidate.email);

        const candidatePhone =
          normalizePhone(candidate.phone);

        return (
          (cleanEmail &&
            candidateEmail === cleanEmail) ||
          (normalizedPhone &&
            candidatePhone === normalizedPhone)
        );
      });

    if (existingMockUser) {
      return res.status(409).json({
        success: false,
        message:
          'An account with this email or phone already exists.',
      });
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: 'customer',
      created_at: new Date().toISOString(),
    };

    mockDbStore.users.push(newUser);

    const safeUser = cleanUser(newUser);
    const token = createToken(safeUser);

    return res.status(201).json({
      success: true,
      message:
        'Account created successfully! Welcome to ManaDeshi Dukaan.',
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);

    /*
     * PostgreSQL unique constraint fallback.
     */
    if (error?.code === '23505') {
      return res.status(409).json({
        success: false,
        message:
          'An account with this email or phone already exists.',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Server error while creating your account.',
    });
  }
}

export async function getMe(req, res) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    const token = authHeader
      .slice('Bearer '.length)
      .trim();

    const decoded = jwt.verify(
      token,
      JWT_SECRET,
    );

    let user = null;

    if (isPgActive()) {
      const result = await query(
        `
        SELECT
          id,
          name,
          email,
          phone,
          role
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [decoded.id],
      );

      if (result.rows.length > 0) {
        user = result.rows[0];
      }
    }

    if (!user) {
      user = mockDbStore.users.find(
        (candidate) =>
          Number(candidate.id) ===
          Number(decoded.id),
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    return res.json({
      success: true,
      user: cleanUser(user),
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        'Your session has expired. Please sign in again.',
    });
  }
}

export default {
  login,
  register,
  getMe,
  seededUsers,
};