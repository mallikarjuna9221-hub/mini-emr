import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPortalMe } from '../../services/api';
import styles from './Portal.module.css';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtDateShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPortalMe().then(setData).catch(err => setError(err.message));
  }, []);

  if (error) return <><NavBar /><div className={styles.errorMsg}>{error}</div></>;
  if (!data) return <><NavBar /><div className={styles.loading}>Loading…</div></>;

  const { patient, upcomingAppointments, upcomingRefills } = data;

  return (
    <>
      <NavBar />
      <div className={styles.page}>
        <h1 className={styles.greeting}>Hello, {patient.name}</h1>
        <p className={styles.sub}>Here's your health summary for the next 7 days.</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Patient Info</h2>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoRow}><span>Name</span><strong>{patient.name}</strong></div>
              <div className={styles.infoRow}><span>Email</span><strong>{patient.email}</strong></div>
              <div className={styles.infoRow}><span>Member Since</span><strong>{fmtDateShort(patient.createdAt)}</strong></div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Upcoming Appointments <span className={styles.badge}>{upcomingAppointments.length}</span></h2>
              <Link to="/portal/appointments" className={styles.seeAll}>See all →</Link>
            </div>
            {upcomingAppointments.length === 0
              ? <p className={styles.empty}>No appointments in the next 7 days.</p>
              : <ul className={styles.itemList}>
                  {upcomingAppointments.map((a, i) => (
                    <li key={i} className={styles.item}>
                      <div className={styles.itemTitle}>{a.provider}</div>
                      <div className={styles.itemSub}>{fmtDate(a.datetime)}</div>
                      {a.repeat !== 'none' && <span className={styles.chip}>{a.repeat}</span>}
                    </li>
                  ))}
                </ul>
            }
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Upcoming Refills <span className={styles.badge}>{upcomingRefills.length}</span></h2>
              <Link to="/portal/medications" className={styles.seeAll}>See all →</Link>
            </div>
            {upcomingRefills.length === 0
              ? <p className={styles.empty}>No refills due in the next 7 days.</p>
              : <ul className={styles.itemList}>
                  {upcomingRefills.map((r, i) => (
                    <li key={i} className={styles.item}>
                      <div className={styles.itemTitle}>{r.medication} <span className={styles.dosage}>{r.dosage}</span></div>
                      <div className={styles.itemSub}>Refill due: {fmtDateShort(r.refillOn)}</div>
                      <span className={styles.chip}>{r.refillSchedule}</span>
                    </li>
                  ))}
                </ul>
            }
          </div>
        </div>
      </div>
    </>
  );
}
