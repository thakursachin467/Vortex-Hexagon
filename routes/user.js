const express= require('express');
let router=  express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');
const users= require('../models/user');


//get the register page
router.get('/register',(req,res)=>{
        res.render('users/register');
});

//get the login page
router.get('/login',(req,res)=>{
          if(req.user) {
            res.redirect('/products/all');
          }
        res.render('users/login');
});

//post data to databse
router.post('/register',(req,res)=>{
  let errors=[];
  let admin=false;
  if(req.body.password!= req.body.password1) {
    errors.push({text:'Your passwords did not match'});
  }
  if(req.body.email!= req.body.email1) {
    errors.push({text:'Your emails did not match'});
  }
  if(req.body.password.length<4){
    errors.push({text:'Password should be more then 4 characters'});
  }
  if(req.body.admin=="imadmin"){
    admin= true;
  }
  if(errors.length>0){
    res.render('users/register',{
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      email1:req.body.email1,
      password:req.body.password,
      password1:req.body.password1,
      admin:req.body.admin
    });
  }
  else {
    users.findOne({email:req.body.email})
    .then((data)=>{
      if(data) {
        req.flash('error_msg','user already exists with this email');
        res.redirect('/user/register');
      }
      else {
          var user = users({
            email:req.body.email,
            name:req.body.name,
            password:req.body.password,
            admin:admin
          });
          bcrypt.genSalt(10,function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
              if(err){
                throw err;
              }
              else {
                  user.password= hash;
                  user.save()
                  .then(()=>{
                      req.flash('success_msg','Your account sucessfully created,please login');
                      res.redirect('/user/login');
                  });
              }
            });
    });

  }
});
}
});

router.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/user/login',
      failureFlash: true })
);


router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','you are sucessfully logged out');
res.redirect('/user/login');

});

module.exports= router;
