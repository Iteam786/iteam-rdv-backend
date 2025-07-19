const express = require('express');
const router = express.Router();
const bhaiController = require('../controllers/bhaiController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// Routes protégées pour Bhai Saheb
router.get('/events', verifyToken, checkRole('bhai'), bhaiController.getEvents);
router.post('/events', verifyToken, checkRole('bhai'), bhaiController.createEvent);
router.put('/events/:id', verifyToken, checkRole('bhai'), bhaiController.updateEvent);
router.delete('/events/:id', verifyToken, checkRole('bhai'), bhaiController.deleteEvent);

module.exports = router;
