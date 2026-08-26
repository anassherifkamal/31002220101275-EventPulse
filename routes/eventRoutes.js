const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const {
  createEventValidator,
  updateEventValidator,
} = require('../middleware/validators');

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Returns a list of all events
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, category, date, capacity]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Conference 2026
 *               category:
 *                 type: string
 *                 example: 60d5ecb8b5c9c22b14e2fe11
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-15T10:00:00.000Z
 *               capacity:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Event created successfully
 *       422:
 *         description: Unprocessable Entity (Validation Failure)
 *
 * /api/events/{id}:
 *   get:
 *     summary: Get single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event data retrieved
 *       404:
 *         description: Event not found
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 */

// Public Endpoints
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected Admin Endpoints
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  createEventValidator,
  validate,
  eventController.createEvent
);

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  updateEventValidator,
  validate,
  eventController.updateEvent
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  eventController.deleteEvent
);

module.exports = router;