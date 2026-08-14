import { Link } from 'react-router-dom';

const statusClass = {
  Pending: 'badge badge-pending',
  'In Progress': 'badge badge-progress',
  Resolved: 'badge badge-resolved',
  Rejected: 'badge badge-rejected',
};

export default function ComplaintCard({ complaint }) {
  return (
    <Link to={`/complaints/${complaint._id}`} className="card complaint-card">
      {complaint.image && (
        <div className="complaint-card-img">
          <img src={complaint.image} alt={complaint.title} />
        </div>
      )}
      <div className="ticket-perf" />
      <div className="complaint-card-body">
        <span className="case-id mono">CASE #CL-{String(complaint._id).slice(-5).toUpperCase()}</span>
        <div className="complaint-card-top">
          <h3>{complaint.title}</h3>
          <span className={statusClass[complaint.status] || 'badge'}>{complaint.status}</span>
        </div>
        <p className="complaint-desc">{complaint.description}</p>
        <div className="complaint-meta">
          <span>📍 {complaint.location}</span>
          <span>🏷️ {complaint.category}</span>
          {complaint.citizen?.name && <span>👤 {complaint.citizen.name}</span>}
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
