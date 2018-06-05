var LocalStrategy= require('passport-local').Strategy;
var mongoose =require('mongoose');
var bcrypt = require('bcryptjs');
var users= require('../models/user');

module.exports = function(passport) {

passport.use(new LocalStrategy({usernameField:'email'},
function(email, password, done) {
  users.findOne({ email: email })
  .then((data)=>{
    if(!data){
        return done(null,false,{error:'user not found'});
    }

      bcrypt.compare(password,data.password,(error,isMatch)=>{
        if(isMatch) {

            return done(null,data);
            console.log('its a match');
        }
           return done(null,false,{error:'password did not match'});
      });

  });
}
));

passport.serializeUser(function(data, done) {
  done(null, data.id);
});

passport.deserializeUser(function(id, done) {
users.findById(id, function(err, data) {
done(err, data);
});
});




};
