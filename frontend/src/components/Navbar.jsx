import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" />
          Civic<span>Lens</span> <small>LITE</small>
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
              {user.role === 'citizen' && <Link to="/new-complaint">New Complaint</Link>}
              <span className="nav-user">
                {user.name} <em>({user.role})</em>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
