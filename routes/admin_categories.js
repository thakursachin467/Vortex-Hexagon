const express= require('express');
const router=express.Router();

// all categories starting with /admin/categories end up here


//our page model
const categories= require('../models/category');

//get all categories page
router.get('/',(req,res)=>{
    categories.find({})
    .then((categories)=>{
      if(categories){
          res.render('admin/categories',{
            categories:categories
          })
      }
      else {
          error='No categories Found';
      }
    })
    .catch(()=>{
      console.log("errors");
    })
});

//get add categories
router.get('/add-category',(req,res)=>{
    let title= "";
    res.render('admin/addcategory',{
      title:title
    });
});

//add a category to the database
router.post('/add-category',(req,res)=>{
    categories.findOne({title:req.body.title})
    .then((category)=>{
          if(category) {
            req.flash('error_msg','This category Already exists');
            res.redirect('/admin/categories/add-category');
          } else {
            let title=req.body.title;
            let slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
            let category = new categories({
              title:title,
              slug:slug
            });
            category.save()
            .then(()=>{
                req.flash('success_msg','Category Added Sucessfully')
                res.redirect('/admin/categories');
            });

          }
    })
    .catch((err)=>{
      console.log(err);
    });
});

//load the edit page for categories
router.get('/edit/:slug',(req,res)=>{

      categories.findOne({slug:req.params.slug})
      .then((category)=>{
          res.render('admin/editcategory',{
            category:category
          })
      });
});

//submit the edit changes to the database
router.post('/edit/:slug',(req,res)=>{
  categories.findOne({title:req.body.title})
  .then((category)=>{
        if(category) {
          req.flash('error_msg','This category Already exists');
          res.redirect('/admin/categories/add-category');
        } else {
      categories.findOne({slug:req.params.slug})
      .then((category)=>{
          category.title= req.body.title;
          category.slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
          category.save()
          .then(()=>{
            req.flash('success_msg','Category Sucessfully Changed');
            res.redirect('/admin/categories');
          })

      });
    } });

});

//delete a category from database
router.get('/delete/:id',(req,res)=>{
        categories.findOneAndRemove({_id:req.params.id})
        .then(()=>{
          req.flash('success_msg','Category Sucessfully Deleted');
          res.redirect('/admin/categories');
        });
});

//export our router
module.exports = router;
