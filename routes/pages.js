const express= require('express');
const router=express.Router();
const pages= require('../models/page');
const categorymodel= require('../models/category');


router.get('/',(req,res)=>{


          categorymodel.find({})
          .then((category)=>{
            res.render('home');
            req.app.locals.category=category;
          });


  });




router.get('/:slug',(req,res)=>{
    let slug= req.params.slug;
    pages.findOne({slug:slug})
    .then((page)=>{
          if(page){
            res.render('index',{
              title:page.title,
              content:page.content
            });

          } else {
            req.flash('error_msg','Page Not found');
            res.redirect('/');
          }

    });

});



module.exports= router;
