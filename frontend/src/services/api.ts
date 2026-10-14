export async function loginUser(payload: {
  emailOrPhone: string;
  password: string;
}): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: payload.emailOrPhone.trim(),
          password: payload.password,
        }),
      },
    );

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid server response.',
    }));

    return data;
  } catch (error) {
    console.error('API loginUser error:', error);

    return {
      success: false,
      message:
        'Unable to connect to the server. Please try again.',
    };
  }
}

export async function registerUser(payload: {
  name: string;
  email?: string;
  phone: string;
  password: string;
}): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payload.name.trim(),
          email: payload.email?.trim() || '',
          phone: payload.phone.trim(),
          password: payload.password,
        }),
      },
    );

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid server response.',
    }));

    return data;
  } catch (error) {
    console.error('API registerUser error:', error);

    return {
      success: false,
      message:
        'Unable to connect to the server. Please try again.',
    };
  }
}

export async function fetchCurrentUser(
  token: string,
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE}/auth/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json().catch(() => ({
      success: false,
    }));

    return data;
  } catch (error) {
    console.error(
      'API fetchCurrentUser error:',
      error,
    );

    return {
      success: false,
      message: 'Unable to validate session.',
    };
  }
}