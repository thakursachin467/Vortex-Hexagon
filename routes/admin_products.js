const express= require('express');
const router=express.Router();
const mkdirp= require('mkdirp');
const fs= require('fs-extra');
const resizeImg= require('resize-img');
//our product model
const products= require('../models/products');
//our categories model
const categories= require('../models/category');



// all pages starting with /admin/products end up here

router.get('/',(req,res)=>{
  let count;
  products.count()
  .then((total)=>{
      count= total;
  });
  products.find()
  .then((products)=>{
      res.render('admin/product',{
          products:products,
          count:count
      });
  })
  .catch((err)=>{
      console.log(err);
  });
});


router.get('/add-product',(req,res)=>{
    categories.find({})
    .then((categories)=>{
        res.render('admin/addproducts',{
          categories:categories
        });
    });

});

router.post('/add-product',(req,res)=>{
      console.log(req.body);
});


module.exports= router;
