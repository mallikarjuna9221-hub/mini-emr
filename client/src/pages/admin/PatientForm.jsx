import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPatient, createPatient, updatePatient } from '../../services/api';
import styles from './Admin.module.css';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getPatient(id).then(p => setForm({ name: p.name, email: p.email, password: '' }))
        .catch(err => setError(err.message));
    }
  }, [id, isEdit]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      if (isEdit) {
        await updatePatient(id, payload);
        navigate(`/admin/patients/${id}`);
      } else {
        if (!form.password) { setError('Password is required'); setLoading(false); return; }
        payload.password = form.password;
        const p = await createPatient(payload);
        navigate(`/admin/patients/${p._id}`);
      }
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
          <Link to="/admin">Patients</Link>
          {isEdit && <> / <Link to={`/admin/patients/${id}`}>Patient</Link></>}
          {' '} / {isEdit ? 'Edit' : 'New Patient'}
        </div>

        <h1>{isEdit ? 'Edit Patient' : 'New Patient'}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Full Name
            <input type="text" value={form.name} onChange={set('name')} required placeholder="John Doe" />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} required placeholder="patient@example.com" />
          </label>
          <label>
            Password {isEdit && <span className={styles.hint}>(leave blank to keep current)</span>}
            <input type="password" value={form.password} onChange={set('password')} required={!isEdit} placeholder="••••••••" />
          </label>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Patient')}
            </button>
            <button type="button" onClick={() => navigate(isEdit ? `/admin/patients/${id}` : '/admin')} className={styles.btnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
