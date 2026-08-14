const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getStats,
  getComplaintById,
  updateStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/stats', getStats);
router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);
router.get('/:id', getComplaintById);
router.patch('/:id/status', authorize('admin'), updateStatus);
router.delete('/:id', deleteComplaint);

module.exports = router;
