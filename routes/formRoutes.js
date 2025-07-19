const express = require('express');
const router = express.Router();
const rendezvousController = require('../controllers/rendezvousController');

router.post('/submit', rendezvousController.submitForm);

module.exports = router;
