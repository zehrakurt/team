
interface RequestOptions extends RequestInit {
  headers?: {
    [key: string]: string;
  };
}

const API_BASE_URL = 'http://localhost:5000/api';


export const httpService = {

  get: async <T>(url: string, options?: RequestOptions): Promise<T> => {
    return request<T>('GET', url, options);
  },

 
  post: async <T>(url: string, body: any, options?: RequestOptions): Promise<T> => {
    return request<T>('POST', url, { body: JSON.stringify(body), ...options });
  },

 
  put: async <T>(url: string, body: any, options?: RequestOptions): Promise<T> => {
    return request<T>('PUT', url, { body: JSON.stringify(body), ...options });
  },

  
  patch: async <T>(url: string, body: any, options?: RequestOptions): Promise<T> => {
    return request<T>('PATCH', url, { body: JSON.stringify(body), ...options });
  },

 
  delete: async <T>(url: string, options?: RequestOptions): Promise<T> => {
    return request<T>('DELETE', url, options);
  },
};


async function request<T>(method: string, url: string, options?: RequestOptions): Promise<T> {

  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json', 
    ...options?.headers, 
  };


  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }


  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    ...options, 
  });

  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API isteği başarısız oldu');
  }
  return response.json();
}
