import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const profile = await register(form.name, form.email, form.password, form.role);
      navigate(profile.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Get started</span>
        <h2>Create an account</h2>
        <p className="muted">Report and track civic issues in your area.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>Full name</label>
        <input
          type="text"
          required
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          required
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label>Account type</label>
        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="citizen">Citizen</option>
          <option value="admin">Administrator</option>
        </select>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <div className="divider"><span>or</span></div>

        <GoogleButton
          onSuccess={(profile) => navigate(profile.role === 'admin' ? '/admin' : '/dashboard')}
          onError={setError}
        />

        <p className="muted small">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
