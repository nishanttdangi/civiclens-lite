import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const [complaintsRes, statsRes] = await Promise.all([
        api.get('/complaints', { params }),
        api.get('/complaints/stats'),
      ]);
      setComplaints(complaintsRes.data.complaints);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const cards = useMemo(
    () => [
      { label: 'Total', value: stats?.total ?? '—' },
      { label: 'Pending', value: stats?.Pending ?? '—' },
      { label: 'In Progress', value: stats?.['In Progress'] ?? '—' },
      { label: 'Resolved', value: stats?.Resolved ?? '—' },
    ],
    [stats]
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Your case file</span>
          <h1>My Complaints</h1>
          <p className="muted">Welcome back, {user?.name}. Track the issues you've reported.</p>
        </div>
        <Link to="/new-complaint" className="btn btn-primary">
          + Report an Issue
        </Link>
      </div>

      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints found.</p>
          <Link to="/new-complaint" className="btn btn-primary btn-sm">
            Report your first issue
          </Link>
        </div>
      ) : (
        <div className="complaint-grid">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
