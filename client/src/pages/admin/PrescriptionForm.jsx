import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPatient, getMedications, getDosages, createPrescription, updatePrescription } from '../../services/api';
import styles from './Admin.module.css';

function toDateInput(d) {
  if (!d) return '';
  const dt = new Date(d);
  const pad = n => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
}

export default function PrescriptionForm() {
  const { id: patientId, rxId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(rxId);

  const [patientName, setPatientName] = useState('');
  const [medications, setMedications] = useState([]);
  const [dosages, setDosages] = useState([]);
  const [form, setForm] = useState({
    medication: '',
    dosage: '',
    quantity: 1,
    refillOn: '',
    refillSchedule: 'monthly',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMedications().then(setMedications);
    getDosages().then(setDosages);
    getPatient(patientId).then(p => {
      setPatientName(p.name);
      if (isEdit) {
        const rx = p.prescriptions.find(x => x._id === rxId);
        if (rx) setForm({
          medication: rx.medication,
          dosage: rx.dosage,
          quantity: rx.quantity,
          refillOn: toDateInput(rx.refillOn),
          refillSchedule: rx.refillSchedule,
        });
      }
    }).catch(err => setError(err.message));
  }, [patientId, rxId, isEdit]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, quantity: Number(form.quantity) };
      if (isEdit) {
        await updatePrescription(patientId, rxId, payload);
      } else {
        await createPrescription(patientId, payload);
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
          <Link to="/admin">Patients</Link> / <Link to={`/admin/patients/${patientId}`}>{patientName || 'Patient'}</Link> / {isEdit ? 'Edit Prescription' : 'New Prescription'}
        </div>

        <h1>{isEdit ? 'Edit Prescription' : 'New Prescription'}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Medication
            <select value={form.medication} onChange={set('medication')} required>
              <option value="">— Select medication —</option>
              {medications.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label>
            Dosage
            <select value={form.dosage} onChange={set('dosage')} required>
              <option value="">— Select dosage —</option>
              {dosages.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          <label>
            Quantity
            <input type="number" min="1" value={form.quantity} onChange={set('quantity')} required />
          </label>
          <label>
            Refill Date
            <input type="date" value={form.refillOn} onChange={set('refillOn')} required />
          </label>
          <label>
            Refill Schedule
            <select value={form.refillSchedule} onChange={set('refillSchedule')} required>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </label>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Add Prescription')}
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
