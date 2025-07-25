import { cookieManager } from "../cookie/cookie";

const request = async <T>(url: string, options: RequestInit = {}) => {
  try {
    const fetchOptions: RequestInit = { ...options };
    if (fetchOptions.body instanceof FormData) {
      fetchOptions.headers = fetchOptions.headers ? { ...fetchOptions.headers } : {};
    } else {
      fetchOptions.headers = fetchOptions.headers ? { ...fetchOptions.headers, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
    }
    const accessToken = await cookieManager.get("accessToken");
    if (accessToken) {
      fetchOptions.headers = { ...fetchOptions.headers, "Authorization": `Bearer ${accessToken}` }
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, fetchOptions);
    return await response.json() as T;
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
}

export const customFetch = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: object) =>
    request<T>(url, {
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(url: string, body: object) =>
    request<T>(url, {
      method: 'PATCH',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: 'DELETE',
    }),
};