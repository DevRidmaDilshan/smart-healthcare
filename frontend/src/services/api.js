import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
    (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const appointmentAPI = {
    searchAvailability: (hospitalId, departmentId, date) =>
        api.get('/appointments/availability', {
            params: { hospitalId, departmentId, date }
        }),

    bookAppointment: (appointmentData) =>
        api.post('/appointments/book', appointmentData),

    getPatientAppointments: (patientId) =>
        api.get(`/appointments/patient/${patientId}`),

    cancelAppointment: (appointmentId, patientId) =>
        api.put(`/appointments/cancel/${appointmentId}`, { patientId })
};

export default api;