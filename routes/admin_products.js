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
      let title= req.body.title;
      let slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
      let price= req.body.price;
      let pricenew= parseFloat(price).toFixed(2);
      let description= req.body.description;
      let category= req.body.category;
      let image= req.files.image.name;
      products.findOne({slug:slug})
      .then((product)=>{
          if(product) {
            req.flash('error_msg','This Product Already Exists');
            res.redirect('/admin/products/add-product');
          } else {
              let productnew= new products({
                title:title,
                slug:slug,
                price:pricenew,
                description:description,
                category:category,
                image:image
              });
              productnew.save()
              .then(()=>{
                  mkdirp('public/product_images/'+ productnew._id,error => console.log(error) );
                  mkdirp('public/product_images/'+ productnew._id+'/gallery',error => console.log(error) );
                  mkdirp('public/product_images/'+ productnew._id+'/gallery/thumbs',error => console.log(error) );
                  let productimage= req.files.image;
                    console.log(productimage.mv());
                  let path= 'public/product_images/'+ productnew._id +'/'+image;
                  productimage.mv(path,error => console.log(error));
                  req.flash('success_msg','Product Added Sucessfully');
                  res.redirect('/admin/products');
              });
          }
      });

});


module.exports= router;
