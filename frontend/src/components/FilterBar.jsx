const CATEGORIES = ['Roads', 'Water', 'Electricity', 'Sanitation', 'Public Safety', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function FilterBar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by title, description or location..."
        value={filters.search}
        onChange={(e) => update('search', e.target.value)}
        className="input filter-search"
      />

      <select value={filters.status} onChange={(e) => update('status', e.target.value)} className="input">
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={filters.category} onChange={(e) => update('category', e.target.value)} className="input">
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
