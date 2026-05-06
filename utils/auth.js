const jwt = require("jsonwebtoken");


// Middleware to populate req.user from JWT
exports.populateUser = (req, res, next) => {
  res.locals.isUserAdmin = exports.isUserAdmin;
  res.locals.currentPath = req.path;
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    res.locals.user = req.user;
    next();
  });
}

// Middleware to verify JWT from cookie
exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.render('login', {message: "Invalid or expired token"});
    }
    req.user = user;
    next();
  });
}

exports.isUserAdmin = (user) => user?.role === 'admin';

// Middleware for admin role
exports.isAdmin = (req, res, next) => {
  if (exports.isUserAdmin(req.user)) return next();
  res.render('login', {message: "Access denied"});
}
