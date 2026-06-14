import type { ContactMessage, DeliveryRegion, Order, OrderMapPoint, Product, User, WhatsAppConfig } from '../types';

const API = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');

function backendNotConfiguredMessage(): string {
  return 'The order server is not connected yet. Please contact Agrahara Bhojanam support or try again in a few minutes.';
}

async function parseJsonResponse<T>(res: Response, text: string): Promise<T> {
  if (text.trim().startsWith('It works')) {
    throw new Error(backendNotConfiguredMessage());
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.ok
        ? 'The server returned an unexpected response. Please try again or contact support.'
        : `API error: ${res.status}`,
    );
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();

  if (!res.ok) {
    try {
      const body = await parseJsonResponse<{ error?: string }>(res, text);
      throw new Error(body.error || `API error: ${res.status}`);
    } catch (err) {
      throw err instanceof Error ? err : new Error(`API error: ${res.status}`);
    }
  }
  if (res.status === 204) return undefined as T;
  return parseJsonResponse<T>(res, text);
}

export type CustomerAuthInput = {
  name: string;
  email: string;
  phone: string;
  address?: string;
};

export const api = {
  getProducts: () => request<Product[]>('/products'),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createOrder: (order: Order) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(order) }),
  createContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'resolved'>) =>
    request<ContactMessage>('/contact-messages', { method: 'POST', body: JSON.stringify(msg) }),
  registerUser: (input: CustomerAuthInput) =>
    request<User>('/users/register', { method: 'POST', body: JSON.stringify(input) }),
  loginUser: (input: CustomerAuthInput) =>
    request<User>('/users/login', { method: 'POST', body: JSON.stringify(input) }),
  getOrderMapPoints: (region: DeliveryRegion | 'all' = 'all') =>
    request<OrderMapPoint[]>(`/orders/map-points?region=${region}`),
  getWhatsApp: () => request<WhatsAppConfig>('/config/whatsapp'),
};
