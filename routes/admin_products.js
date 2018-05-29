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

//add products route
router.get('/add-product',(req,res)=>{
    categories.find({})
    .then((categories)=>{
        res.render('admin/addproducts',{
          categories:categories
        });
    });

});

//add products details here
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

//edit a product
router.get('/edit/:id',(req,res)=>{

      products.findOne({_id:req.params.id})
      .then((product)=>{
          if(product) {
            var galleryDir= 'public/product_images/' + product._id  +'/gallery/thumbs';
              var galleryImages= null;
              fs.readdir(galleryDir)
              .then((files)=>{
                if(files) {
                  galleryImages=files;
                }
                else {
                  galleryImages= null;
                }
                  res.render('admin/edit-product',{
                        product:product,
                        galleryImages:galleryImages,
                        cate: product.category.replace('/\s+/g','-').toLowerCase()
                  });
              });


          }else {
            req.flash('error_msg','No such Product found');
            res.redirect('/admin/products');
          }
      });
});

router.post('/edit/:id',(req,res)=>{
  let title= req.body.title;
  let slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
  let price= req.body.price;
  let pricenew= parseFloat(price).toFixed(2);
  let description= req.body.content;
  let category= req.body.category;
  let image;
  if(req.files!=null) {
    image=   req.files.image.name;
  } else {
   image= null;
  }

  products.findOne({slug:slug,_id:{'$ne':req.params.id}})
  .then((product)=>{
    if(product){
          req.flash('error_msg',`This product name ${title} already exists please choose another one`);
          res.redirect('/admin/products/edit/'+ req.params.id);

    } else {
          products.findById(req.params.id)
          .then((product)=>{
            product.title= title;
            product.slug= slug;
            product.price= pricenew;
            product.description= description;
            product.category= category;
            let oldimage= product.image;
            if(image!=null) {
              product.image= image;
            }
            product.save()
            .then((productnew)=>{
                if (image!=null) {
                  let path= 'public/product_images/'+ productnew._id +'/'+image;
                /*  if(oldimage!=""){
                    fs.remove(path);
                  } */
                  let productimage= req.files.image;
                  productimage.mv(path,error => console.log(error));
                }
                req.flash('success_msg','Sucessfully Save New Info');
                res.redirect('/admin/products/edit/'+ req.params.id);
            });

          });
    }
  });
});

//delete an item from the database
router.get('/delete/:id',(req,res)=>{
  products.findOne({_id:req.params.id})
  .then((product)=>{
      if(product) {
            let path= 'public/product_images/'+ product._id;
            fs.remove(path,(err)=>{
              if(err) {
                console.log(err);
              } else {
                products.findOneAndRemove({_id:req.params.id})
                .then(()=>{
                    req.flash('success_msg','Item Deleted Sucessfully');
                    res.redirect('/admin/products');
                });
              }
            });



      }else {
        req.flash('error_msg','No such Product found');
        res.redirect('/admin/products');
      }
  });
});

//post product Images to gallery
router.post('/product-gallery/:id',(req,res)=>{

      let productImage= req.files.file;
      let id= req.params.id;
      let path= 'public/product_images/'+ id +'/gallery/'+req.files.file.name;
      let thumbspath= 'public/product_images/'+ id +'/gallery/thumbs/'+req.files.file.name;
      productImage.mv(path,err=> console.log(err));
        productImage.mv(thumbspath,err=> console.log(err));

        res.sendStatus(200);

});

//delete image from the gallery
router.get('/delete-image/:name',(req,res)=>{
      console.log(req.params.name);
      console.log(req.query.id);
      let originalImage= 'public/product_images/'+ req.query.id +'/gallery/'+req.params.name;
      let thumbImage= 'public/product_images/'+ req.query.id +'/gallery/thumbs/'+req.params.name;
      fs.remove(originalImage,(err)=>{
          fs.remove(thumbImage,(err)=>{

            req.flash('success_msg','Image Deleted Sucessfully');
            res.redirect('/admin/products/edit/'+req.query.id);
          })
      });
});

module.exports= router;
