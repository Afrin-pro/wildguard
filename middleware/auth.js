const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = 'Please log in to access this page.';
    return res.redirect('/auth/login');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.session.error = 'Access denied. Admin privileges required.';
    return res.redirect('/');
  }
  next();
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.user) return res.redirect('/');
  next();
};

module.exports = { requireLogin, requireAdmin, redirectIfLoggedIn };
