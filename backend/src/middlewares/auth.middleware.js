exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.user = req.session.user;
  next();
};


exports.requireRole = (role) => {
  return(req, res, next) => {
    if(!req.session.user || req.session.user.role !== role) {
        return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    next();
    };
};
