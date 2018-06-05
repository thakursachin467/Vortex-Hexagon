module.exports = {
  ensureAuthenticated:function(req,res,next) {
        if(req.isAuthenticated()){
          return next();
        }
        req.flash('error_msg','Please login first');
        res.redirect('/login');
  },
  ensureAdmin:function(req,res,next) {
        if(req.isAuthenticated() && req.user.admin ){
          return next();
        }
        req.flash('error_msg','Please Login As Admin');
        res.redirect('/dashboard');
  }
}
