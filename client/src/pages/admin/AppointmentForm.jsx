import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPatient, createAppointment, updateAppointment } from '../../services/api';
import styles from './Admin.module.css';

function toDatetimeLocal(d) {
  if (!d) return '';
  const dt = new Date(d);
  const pad = n => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function toDateInput(d) {
  if (!d) return '';
  const dt = new Date(d);
  const pad = n => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
}

export default function AppointmentForm() {
  const { id: patientId, apptId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(apptId);

  const [patientName, setPatientName] = useState('');
  const [form, setForm] = useState({ provider: '', datetime: '', repeat: 'none', endDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatient(patientId).then(p => {
      setPatientName(p.name);
      if (isEdit) {
        const a = p.appointments.find(x => x._id === apptId);
        if (a) setForm({
          provider: a.provider,
          datetime: toDatetimeLocal(a.datetime),
          repeat: a.repeat,
          endDate: toDateInput(a.endDate),
        });
      }
    }).catch(err => setError(err.message));
  }, [patientId, apptId, isEdit]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        provider: form.provider,
        datetime: form.datetime,
        repeat: form.repeat,
        endDate: form.endDate || null,
      };
      if (isEdit) {
        await updateAppointment(patientId, apptId, payload);
      } else {
        await createAppointment(patientId, payload);
      }
      navigate(`/admin/patients/${patientId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar variant="admin" />
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <Link to="/admin">Patients</Link> / <Link to={`/admin/patients/${patientId}`}>{patientName || 'Patient'}</Link> / {isEdit ? 'Edit Appointment' : 'New Appointment'}
        </div>

        <h1>{isEdit ? 'Edit Appointment' : 'New Appointment'}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Provider Name
            <input type="text" value={form.provider} onChange={set('provider')} required placeholder="Dr. Jane Smith" />
          </label>
          <label>
            Date &amp; Time
            <input type="datetime-local" value={form.datetime} onChange={set('datetime')} required />
          </label>
          <label>
            Repeat Schedule
            <select value={form.repeat} onChange={set('repeat')}>
              <option value="none">No Repeat</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          {form.repeat !== 'none' && (
            <label>
              End Recurring On <span className={styles.hint}>(optional)</span>
              <input type="date" value={form.endDate} onChange={set('endDate')} />
            </label>
          )}

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Add Appointment')}
            </button>
            <button type="button" onClick={() => navigate(`/admin/patients/${patientId}`)} className={styles.btnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
