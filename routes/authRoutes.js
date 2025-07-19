const express = require('express');
const router = express.Router();

const BH_PASSWORD = process.env.BHAI_PASSWORD;
const OFFICE_PASSWORD = process.env.OFFICE_PASSWORD;

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'bhai' && password === BH_PASSWORD) {
    return res.status(200).json({ success: true, adminType: 'Bhai Saheb' });
  }

  if (username === 'office' && password === OFFICE_PASSWORD) {
    return res.status(200).json({ success: true, adminType: 'Office Jamaat' });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;
