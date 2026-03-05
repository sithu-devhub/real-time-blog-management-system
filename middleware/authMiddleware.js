// module.exports = {
//     ensureAuthenticated: (req, res, next) => {
//       if (req.isAuthenticated()) return next();
//       req.flash('error_msg', 'You must be logged in');
//       res.redirect('/login');
//     }
//   };
  

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    // console.log("=== [ensureAuthenticated] ===");
    // console.log("req.isAuthenticated():", req.isAuthenticated?.());
    // console.log("req.user:", req.user);
    
    if (req.isAuthenticated()) return next();

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    req.flash('error_msg', 'You must be logged in');
    res.redirect('/login');
  }
};
