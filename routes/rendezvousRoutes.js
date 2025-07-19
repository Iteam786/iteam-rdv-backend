const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// Ce fichier peut contenir des routes publiques si nécessaire
router.post('/submit', rendezvousController.submitForm);

module.exports = router;
