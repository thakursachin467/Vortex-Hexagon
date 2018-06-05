const express= require('express');
let router=  express.Router();
const products= require('../models/products');
const categorymodel= require('../models/category');
const {ensureAuthenticated,ensureAdmin} = require('../helpers/auth');
//add product to cart

router.get('/add/:slug',ensureAuthenticated,(req,res)=>{


      products.findOne({slug:req.params.slug})
      .then((product)=>{
        if(typeof req.session.cart=="undefined") {

          req.session.cart=[];
          req.session.cart.push({
            title:req.params.slug,
            quantity: 1,
            price: product.price,
            image: 'product_images/' + product._id + '/' + product.image
          });
          req.session.save();
        } else {

          var cart= req.session.cart;
          var newItem= true;
          for(var i=0;i<cart.length;i++) {

            if(cart[i].title==req.params.slug) {

                cart[i].quantity++;
                newItem=false;
                break;
            }

          }

          if(newItem) {
            req.session.cart.push({
              title:req.params.slug,
              quantity: 1,
              price: product.price,
              image: 'product_images/' + product._id + '/' + product.image
            });
          }
          req.session.save()
        }
        //console.log(req.session.cart);
        req.flash('success_msg','Item Added to cart');
        res.redirect('back');

      });
});


//get checkout page
router.get('/checkout',ensureAuthenticated,(req,res)=>{
  res.render('users/checkout',{
    cart:req.session.cart
  })
})

//update on product
router.get('/update/:title',ensureAuthenticated,(req,res)=>{
        var title= req.params.title;
        var action= req.query.action;
        var cart= req.session.cart;

        for(var i=0;i<cart.length;i++) {
              if(cart[i].title==title) {
                switch (action) {
                  case "add":
                    cart[i].quantity++;
                    break;
                  case "remove":
                    cart[i].quantity--;
                    if(cart[i].quantity<1) {
                      cart.splice(i,1);
                    }
                    break;
                  case "clear":
                    cart.splice(i,1);
                    if(cart.length==0) {
                      delete req.session.cart;
                    }
                    break;
                  default:
                    console.log("error");
                    break;
                }
                break;
              }
        }
        res.redirect('/cart/checkout');
});

router.get('/clear',ensureAuthenticated,(req,res)=>{
  delete req.session.cart;
  req.flash('success_msg','Cart cleared');
  res.redirect('/cart/checkout');
});

module.exports= router;
