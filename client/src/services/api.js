const BASE = import.meta.env.VITE_API_URL || '';

function headers() {
  const token = localStorage.getItem('token');
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const login = (email, password) => request('POST', '/api/auth/login', { email, password });

// Reference
export const getMedications = () => request('GET', '/api/reference/medications');
export const getDosages = () => request('GET', '/api/reference/dosages');

// Admin - Patients
export const getPatients = () => request('GET', '/api/patients');
export const getPatient = (id) => request('GET', `/api/patients/${id}`);
export const createPatient = (data) => request('POST', '/api/patients', data);
export const updatePatient = (id, data) => request('PUT', `/api/patients/${id}`, data);

// Admin - Appointments
export const createAppointment = (patientId, data) => request('POST', `/api/patients/${patientId}/appointments`, data);
export const updateAppointment = (patientId, apptId, data) => request('PUT', `/api/appointments/${patientId}/${apptId}`, data);
export const deleteAppointment = (patientId, apptId) => request('DELETE', `/api/appointments/${patientId}/${apptId}`);

// Admin - Prescriptions
export const createPrescription = (patientId, data) => request('POST', `/api/patients/${patientId}/prescriptions`, data);
export const updatePrescription = (patientId, rxId, data) => request('PUT', `/api/prescriptions/${patientId}/${rxId}`, data);
export const deletePrescription = (patientId, rxId) => request('DELETE', `/api/prescriptions/${patientId}/${rxId}`);

// Portal
export const getPortalMe = () => request('GET', '/api/portal/me');
export const getPortalAppointments = () => request('GET', '/api/portal/appointments');
export const getPortalPrescriptions = () => request('GET', '/api/portal/prescriptions');
