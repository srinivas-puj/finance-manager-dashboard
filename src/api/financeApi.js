const getApiBaseUrl = () => {
  const base = process.env.REACT_APP_API_BASE_URL || '';
  return base.toString().trim().replace(/\/+$/, '');
};

const getAuthHeaders = () => {
  // Optional: set auth token if your backend requires it.
  const token =
    process.env.REACT_APP_API_TOKEN ||
    window.localStorage.getItem('authToken') ||
    '';

  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API request failed (${res.status}): ${text || res.statusText}`);
  }

  // Some backends return empty body for deletes.
  if (res.status === 204) return null;

  return res.json();
};

export const fetchTransactions = async () => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('REACT_APP_API_BASE_URL is not set');
  }

  return requestJson(`${baseUrl}/transactions`, { method: 'GET' });
};

export const createTransaction = async (transaction) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('REACT_APP_API_BASE_URL is not set');
  }

  return requestJson(`${baseUrl}/transactions`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
};

export const updateTransaction = async (id, transaction) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('REACT_APP_API_BASE_URL is not set');
  }

  return requestJson(`${baseUrl}/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
};

export const deleteTransaction = async (id) => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('REACT_APP_API_BASE_URL is not set');
  }

  return requestJson(`${baseUrl}/transactions/${id}`, {
    method: 'DELETE',
  });
};

