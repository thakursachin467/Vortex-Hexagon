const express= require('express');
const router= express.Router();
const products= require('../models/products');
const categorymodel= require('../models/category');
const fs= require('fs-extra');


router.get('/all',(req,res)=>{
  products.find({})
  .then((product)=>{
    categorymodel.find({})
    .then((category)=>{
      res.render('users/all-products',{
        products:product
      });
      req.app.locals.category=category;
    });
  })
});

//show product by category
router.get('/:slug',(req,res)=>{
  products.find({category:req.params.slug})
  .then((product)=>{
    categorymodel.find({})
    .then((category)=>{
      res.render('users/cat-products',{
        product:product
      });
      req.app.locals.category=category;
    });

  });
});

//get product details
router.get('/:category/:slug',(req,res)=>{
      let galleryImages= null;
      products.findOne({slug:req.params.slug})
      .then((product)=>{
              let galleryDir= 'public/product_images/' + product._id + '/gallery/thumbs';
              fs.readdir(galleryDir,(err,files)=>{
                    if (err){ console.log(err)}
                    else {
                      
                      galleryImages=files;
                      res.render('users/product-details',{
                          galleryImages:galleryImages,
                          product:product
                      })
                    }


              });
      });
});




module.exports= router;
