export const requireAuth = (req, res, next) => {
  const { adminType } = req.query;

  if (!adminType || (adminType !== 'Bhai Saheb' && adminType !== 'Office Jamaat')) {
    return res.status(403).json({ message: 'Accès refusé : type d\'admin invalide.' });
  }

  next();
};
