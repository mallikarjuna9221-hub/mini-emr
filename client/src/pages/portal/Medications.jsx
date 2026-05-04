import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { getPortalPrescriptions } from '../../services/api';
import styles from './Portal.module.css';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Medications() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortalPrescriptions()
      .then(setPrescriptions)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>My Medications</h1>
        <p className={styles.sub}>All active prescriptions and upcoming refill dates.</p>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {loading && <div className={styles.loading}>Loading…</div>}

        {!loading && prescriptions.length === 0 && (
          <p className={styles.empty}>No active prescriptions.</p>
        )}

        {prescriptions.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Quantity</th>
                  <th>Refill Schedule</th>
                  <th>Next Refill</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(rx => (
                  <tr key={rx._id}>
                    <td><strong>{rx.medication}</strong></td>
                    <td>{rx.dosage}</td>
                    <td>{rx.quantity}</td>
                    <td><span className={styles.chip}>{rx.refillSchedule}</span></td>
                    <td>{fmtDate(rx.nextRefill)}</td>
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
