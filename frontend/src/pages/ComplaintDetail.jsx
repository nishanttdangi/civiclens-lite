import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const statusClass = {
  Pending: 'badge badge-pending',
  'In Progress': 'badge badge-progress',
  Resolved: 'badge badge-resolved',
  Rejected: 'badge badge-rejected',
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
      setStatusForm({ status: data.status, note: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/complaints/${id}/status`, statusForm);
      await fetchComplaint();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error && !complaint) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!complaint) return null;

  const canDelete = user.role === 'admin' || (String(complaint.citizen?._id) === String(user._id) && complaint.status === 'Pending');

  return (
    <div className="page">
      <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="back-link">
        ← Back to dashboard
      </Link>

      <div className="detail-grid">
        <div className="card detail-main">
          <span className="case-id mono">CASE #CL-{String(complaint._id).slice(-5).toUpperCase()}</span>
          <div className="complaint-card-top">
            <h1>{complaint.title}</h1>
            <span className={statusClass[complaint.status]}>{complaint.status}</span>
          </div>

          {complaint.image && (
            <div className="detail-image">
              <img src={complaint.image} alt={complaint.title} />
            </div>
          )}

          <p>{complaint.description}</p>

          <div className="complaint-meta detail-meta">
            <span>📍 {complaint.location}</span>
            <span>🏷️ {complaint.category}</span>
            <span>👤 {complaint.citizen?.name} ({complaint.citizen?.email})</span>
            <span>🗓️ Reported {new Date(complaint.createdAt).toLocaleString()}</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {canDelete && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete Complaint
            </button>
          )}
        </div>

        <div className="detail-side">
          {user.role === 'admin' && (
            <div className="card">
              <h3>Update Status</h3>
              <form onSubmit={handleStatusUpdate}>
                <label>Status</label>
                <select
                  className="input"
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label>Note (optional)</label>
                <textarea
                  className="input textarea"
                  rows={3}
                  placeholder="Add a note about this update..."
                  value={statusForm.note}
                  onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                />

                <button className="btn btn-primary" type="submit" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </div>
          )}

          <div className="card">
            <h3>Complaint History</h3>
            <ul className="timeline">
              {[...complaint.statusHistory].reverse().map((entry, i) => (
                <li key={i} className="timeline-item">
                  <span className={statusClass[entry.status]}>{entry.status}</span>
                  {entry.note && <p className="timeline-note">{entry.note}</p>}
                  <p className="timeline-meta">
                    {entry.changedBy?.name ? `by ${entry.changedBy.name} · ` : ''}
                    {new Date(entry.changedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
