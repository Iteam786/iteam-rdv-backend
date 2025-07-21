export const login = (req, res) => {
  const { adminType, password } = req.body;
  const bhaiPassword = "bhai@123";
  const officePassword = "office@123";

  if (
    (adminType === "bhai" && password === bhaiPassword) ||
    (adminType === "office" && password === officePassword)
  ) {
    return res.status(200).json({ success: true });
  }

  res.status(401).json({ error: "Mot de passe incorrect" });
};