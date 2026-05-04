import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPatients } from '../../services/api';
import styles from './Admin.module.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar variant="admin" />
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>Patients</h1>
          <Link to="/admin/patients/new" className={styles.btnPrimary}>+ New Patient</Link>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {loading && <div className={styles.loading}>Loading…</div>}

        {!loading && patients.length === 0 && (
          <p className={styles.empty}>No patients yet. <Link to="/admin/patients/new">Create one.</Link></p>
        )}

        {patients.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Appointments</th>
                  <th>Prescriptions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p._id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.email}</td>
                    <td><span className={styles.countBadge}>{p.appointmentCount}</span></td>
                    <td><span className={styles.countBadge}>{p.prescriptionCount}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/patients/${p._id}`} className={styles.linkBtn}>View</Link>
                        <Link to={`/admin/patients/${p._id}/edit`} className={styles.linkBtnSecondary}>Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
