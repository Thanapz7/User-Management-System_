function requireAuth(req, res, next) {
  const userCookie = req.cookies.user;
  if (!userCookie) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = JSON.parse(userCookie);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid session' });
  }
}

function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== roleName) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

const requireAdmin = requireRole('admin');

module.exports = { requireAuth, requireAdmin, requireRole };

