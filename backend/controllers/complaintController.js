const Complaint = require('../models/Complaint');

// @route POST /api/complaints
// Citizens register a new complaint, optionally with an evidence image
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Title, description and location are required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      citizen: req.user._id,
      statusHistory: [
        { status: 'Pending', note: 'Complaint registered', changedBy: req.user._id },
      ],
    });

    return res.status(201).json(complaint);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create complaint', error: err.message });
  }
};

// @route GET /api/complaints
// Supports filtering (status, category), search (text), and pagination.
// Citizens see only their own complaints; admins see all.
const getComplaints = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user.role !== 'admin') {
      query.citizen = req.user._id;
    }
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    return res.json({
      complaints,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};

// @route GET /api/complaints/stats
// Small aggregate used by the dashboard cards
const getStats = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { citizen: req.user._id };
    const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    const counts = await Promise.all(
      statuses.map((status) => Complaint.countDocuments({ ...query, status }))
    );
    const total = await Complaint.countDocuments(query);
    const stats = { total };
    statuses.forEach((status, i) => {
      stats[status] = counts[i];
    });
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};

// @route GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && String(complaint.citizen._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    return res.json(complaint);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch complaint', error: err.message });
  }
};

// @route PATCH /api/complaints/:id/status
// Admin-only: update status, which appends to the history/audit trail
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowed = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.statusHistory.push({
      status,
      note: note || '',
      changedBy: req.user._id,
    });

    await complaint.save();
    return res.json(complaint);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// @route DELETE /api/complaints/:id
// A citizen may withdraw their own pending complaint; admin may delete any.
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const isOwner = String(complaint.citizen) === String(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();
    return res.json({ message: 'Complaint deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete complaint', error: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getStats,
  getComplaintById,
  updateStatus,
  deleteComplaint,
};
