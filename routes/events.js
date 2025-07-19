// Optionnel, si tu veux regrouper les deux types d'événements ici
const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

// Route publique si besoin de tous les événements (à n'utiliser que si justifié)
router.get('/', rendezvousController.getAllEvents);

module.exports = router;
