export const authorize = (allowed = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) return res.status(403).json({ message: 'Forbidden' });
      if (!allowed.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden for role: ' + userRole });
      }
      next();
    } catch (e) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};
