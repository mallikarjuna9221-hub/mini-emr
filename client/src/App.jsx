import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/portal/Dashboard';
import PortalAppointments from './pages/portal/Appointments';
import PortalMedications from './pages/portal/Medications';

import PatientList from './pages/admin/PatientList';
import PatientDetail from './pages/admin/PatientDetail';
import PatientForm from './pages/admin/PatientForm';
import AppointmentForm from './pages/admin/AppointmentForm';
import PrescriptionForm from './pages/admin/PrescriptionForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Patient Portal */}
        <Route path="/" element={<Login />} />
        <Route path="/portal" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/portal/appointments" element={<ProtectedRoute><PortalAppointments /></ProtectedRoute>} />
        <Route path="/portal/medications" element={<ProtectedRoute><PortalMedications /></ProtectedRoute>} />

        {/* Admin / EMR */}
        <Route path="/admin" element={<PatientList />} />
        <Route path="/admin/patients/new" element={<PatientForm />} />
        <Route path="/admin/patients/:id" element={<PatientDetail />} />
        <Route path="/admin/patients/:id/edit" element={<PatientForm />} />
        <Route path="/admin/patients/:id/appointments/new" element={<AppointmentForm />} />
        <Route path="/admin/patients/:id/appointments/:apptId/edit" element={<AppointmentForm />} />
        <Route path="/admin/patients/:id/prescriptions/new" element={<PrescriptionForm />} />
        <Route path="/admin/patients/:id/prescriptions/:rxId/edit" element={<PrescriptionForm />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
