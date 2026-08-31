export const BASE_URL = window.APP_CONFIG?.API_BASE_URL || 'http://localhost:5085/api/v2';
//export const BASE_URL = window.env?.API_BASE || '/api/v2';
const handleUnauthorized = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

const request = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${BASE_URL}/${url}`, { ...options, headers });

        if (response.status === 401) {
            handleUnauthorized();
            return { success: false, data: null, error: "Unauthorized" };
        }

        const contentType = response.headers.get("content-type");
        if (response.status === 204 || (!contentType || !contentType.includes("application/json"))) {
            return { success: response.ok, data: null, error: response.ok ? null : "Operation failed" };
        }

        const data = await response.json();
        return { 
            success: response.ok, 
            data: response.ok ? data : null, 
            error: response.ok ? null : (data.message || data.error || "Server Error") 
        };
    } catch {
        return { success: false, data: null, error: "Network error or Server is unreachable." };
    }
};

export const createApiServiceV2 = (endpoint) => ({
    getReport: (page = 1, size = 10) => 
        request(`${endpoint}/report?pageNumber=${page}&pageSize=${size}`),
        
    getAll: () => request(`${endpoint}`),
    getById: (id) => request(`${endpoint}/${id}`),
    create: (payload) => request(`${endpoint}`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify({ ...payload, id }) }),
    remove: (id) => request(`${endpoint}/${id}`, { method: 'DELETE' }),

    postFormData: (formData) => request(`${endpoint}`, { method: 'POST', body: formData }),
    updateFormData: (subPath, formData) => request(`${endpoint}/${subPath}`, { method: 'PUT', body: formData }),
    getCustomPath: (subPath) => request(`${endpoint}/${subPath}`),
    postCustomPath: (subPath, payload) => request(`${endpoint}/${subPath}`, { method: 'POST', body: JSON.stringify(payload) })
});