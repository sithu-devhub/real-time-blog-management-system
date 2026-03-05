// middleware/isAdmin.js
module.exports = function(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error('Unauthorized access attempt detected.');

    // Render 500 error page instead of sending plain text
    res.status(500).render('errors/500', { 
      message: 'Access denied. Admins only.' 
    });
  }
};
