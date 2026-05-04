import { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { getPortalAppointments } from '../../services/api';
import styles from './Portal.module.css';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortalAppointments()
      .then(setAppointments)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Appointment Schedule</h1>
        <p className={styles.sub}>All upcoming appointments over the next 3 months.</p>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {loading && <div className={styles.loading}>Loading…</div>}

        {!loading && appointments.length === 0 && (
          <p className={styles.empty}>No upcoming appointments in the next 3 months.</p>
        )}

        {appointments.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Date &amp; Time</th>
                  <th>Recurrence</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a, i) => (
                  <tr key={i}>
                    <td>{a.provider}</td>
                    <td>{fmtDate(a.datetime)}</td>
                    <td><span className={styles.chip}>{a.repeat}</span></td>
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
