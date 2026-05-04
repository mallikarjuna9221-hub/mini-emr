import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { getPatient, deleteAppointment, deletePrescription } from '../../services/api';
import styles from './Admin.module.css';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtDateShort(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  function loadPatient() {
    getPatient(id).then(setPatient).catch(err => setError(err.message));
  }

  useEffect(() => { loadPatient(); }, [id]);

  async function handleDeleteAppt(apptId) {
    if (!confirm('Delete this appointment?')) return;
    try {
      await deleteAppointment(id, apptId);
      loadPatient();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteRx(rxId) {
    if (!confirm('Delete this prescription?')) return;
    try {
      await deletePrescription(id, rxId);
      loadPatient();
    } catch (err) {
      alert(err.message);
    }
  }

  if (error) return <><NavBar variant="admin" /><div className={styles.errorMsg} style={{margin:24}}>{error}</div></>;
  if (!patient) return <><NavBar variant="admin" /><div className={styles.loading}>Loading…</div></>;

  return (
    <>
      <NavBar variant="admin" />
      <div className={styles.page}>
        <div className={styles.breadcrumb}>
          <Link to="/admin">Patients</Link> / {patient.name}
        </div>

        <div className={styles.pageHeader}>
          <h1>{patient.name}</h1>
          <Link to={`/admin/patients/${id}/edit`} className={styles.btnSecondary}>Edit Patient</Link>
        </div>

        <div className={styles.infoBar}>
          <span><label>Email</label> {patient.email}</span>
        </div>

        {/* Appointments section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Appointments</h2>
            <Link to={`/admin/patients/${id}/appointments/new`} className={styles.btnPrimary}>+ Add Appointment</Link>
          </div>
          {patient.appointments.length === 0
            ? <p className={styles.empty}>No appointments.</p>
            : <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Date &amp; Time</th>
                      <th>Repeat</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.provider}</td>
                        <td>{fmtDate(a.datetime)}</td>
                        <td><span className={styles.chip}>{a.repeat}</span></td>
                        <td>{a.endDate ? fmtDateShort(a.endDate) : '—'}</td>
                        <td>
                          <div className={styles.actions}>
                            <Link to={`/admin/patients/${id}/appointments/${a._id}/edit`} className={styles.linkBtn}>Edit</Link>
                            <button onClick={() => handleDeleteAppt(a._id)} className={styles.linkBtnDanger}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>

        {/* Prescriptions section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Prescriptions</h2>
            <Link to={`/admin/patients/${id}/prescriptions/new`} className={styles.btnPrimary}>+ Add Prescription</Link>
          </div>
          {patient.prescriptions.length === 0
            ? <p className={styles.empty}>No prescriptions.</p>
            : <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Quantity</th>
                      <th>Refill On</th>
                      <th>Schedule</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient.prescriptions.map(rx => (
                      <tr key={rx._id}>
                        <td><strong>{rx.medication}</strong></td>
                        <td>{rx.dosage}</td>
                        <td>{rx.quantity}</td>
                        <td>{fmtDateShort(rx.refillOn)}</td>
                        <td><span className={styles.chip}>{rx.refillSchedule}</span></td>
                        <td>
                          <div className={styles.actions}>
                            <Link to={`/admin/patients/${id}/prescriptions/${rx._id}/edit`} className={styles.linkBtn}>Edit</Link>
                            <button onClick={() => handleDeleteRx(rx._id)} className={styles.linkBtnDanger}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    </>
  );
}
