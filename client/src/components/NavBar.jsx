import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar({ variant }) {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  if (variant === 'admin') {
    return (
      <nav className={styles.nav}>
        <Link to="/admin" className={styles.brand}>Mini-EMR Admin</Link>
        <div className={styles.links}>
          <Link to="/admin" className={location.pathname === '/admin' ? styles.active : ''}>Patients</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <Link to="/portal" className={styles.brand}>Patient Portal</Link>
      <div className={styles.links}>
        <Link to="/portal" className={location.pathname === '/portal' ? styles.active : ''}>Dashboard</Link>
        <Link to="/portal/appointments" className={location.pathname === '/portal/appointments' ? styles.active : ''}>Appointments</Link>
        <Link to="/portal/medications" className={location.pathname === '/portal/medications' ? styles.active : ''}>Medications</Link>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}
