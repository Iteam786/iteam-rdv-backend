export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { adminType } = req.query;

    if (!allowedRoles.includes(adminType)) {
      return res.status(403).json({ message: 'Accès interdit : rôle non autorisé.' });
    }

    next();
  };
};
