// 📁 routes/authRoutes.js
import express from "express";
const router = express.Router();

const adminPasswords = {
  bhai: "bhai786",
  office: "office786"
};

router.post("/login", (req, res) => {
  const { adminType, password } = req.body;

  if (adminPasswords[adminType] && adminPasswords[adminType] === password) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: "Mot de passe incorrect." });
  }
});

export default router;
