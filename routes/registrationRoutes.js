const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const requireAuth = require('../middleware/requireAuth');

// Protect all registration routes with requireAuth
router.use(requireAuth);

router.post('/', registerForEvent);
router.get('/my', getMyRegistrations);
router.delete('/:id', cancelRegistration);

module.exports = router;