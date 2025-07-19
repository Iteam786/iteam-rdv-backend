const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// Routes protégées pour Office Jamaat
router.get('/events', verifyToken, checkRole('office'), officeController.getEvents);
router.post('/events', verifyToken, checkRole('office'), officeController.createEvent);
router.put('/events/:id', verifyToken, checkRole('office'), officeController.updateEvent);
router.delete('/events/:id', verifyToken, checkRole('office'), officeController.deleteEvent);

module.exports = router;
