const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getEventAnnouncements,
} = require('../controllers/announcementController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

// Public route: fetch past history
router.get('/:eventId', getEventAnnouncements);

// Admin-only route: publish real-time announcement
router.post('/', requireAuth, requireRole('admin'), createAnnouncement);

module.exports = router;