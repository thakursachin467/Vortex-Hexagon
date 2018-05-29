const express= require('express');
const router=express.Router();

// all pages starting with /admin/pages end up here


//our page model
const pages= require('../models/page');


//get admin index
router.get('/',(req,res)=>{
    pages.find({})
    .sort({sorting:1})
    .then((pages)=>{
      if(pages){
          res.render('admin/pages',{
            pages:pages
          })
      }
      else {
          error='No Pages Found';
      }
    })
    .catch(()=>{
      console.log("errors");
    })
});


//get add page
router.get('/add-page',(req,res)=>{
    let title= "";
    let slug="";
    let content="";
    res.render('admin/addpage',{
      title:title,
      slug:slug,
      content:content
    });
});

//add pages to the database
router.post('/add-page',(req,res)=>{
  let title= req.body.title;
  let slug;
  if(req.body.slug==""){
    slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
  }
  else {
    slug= req.body.slug.replace(/\s+/g,'-').toLowerCase();
  }
  let content= req.body.content;
  pages.findOne({slug:slug})
  .then((page)=>{
      if(page) {
        error='This page slug already exists,choose another';
          res.render('admin/addpage',{
            error:error,
            title:title,
            slug:slug,
            content:content
          });

      }
      else {
        let page= new pages({
          title:title,
          slug:slug,
          content:content,
          sorting:100
        });

        page.save()
        .then(()=>{
          pages.find({})
          .sort({sorting:1})
          .then((page)=>{
            req.app.locals.pages=page;
          });
          req.flash('success_msg','Page Added sucessfully');
          res.redirect('/admin/pages');
        })
        .catch(()=>{
          console.log('some error');
        });
      }

    });


  });

//router rearrange page
router.post('/reorder',(req,res)=>{
  let ids= req.body['id[]'];
  let count=0;
  for(let i=0;i<ids.length;i++) {
    let id=ids[i];
    count++;
    (function(count){
    pages.findById(id)
    .then((page)=>{
      page.sorting=count;
      page.save()
      .then(()=>{
        pages.find({})
        .sort({sorting:1})
        .then((page)=>{
          req.app.locals.pages=page;
        });
      });

    })
  })(count);
  }

});

//edit page
router.get('/edit/:id',(req,res)=>{

  pages.findOne({slug:req.params.id})
  .then((page)=>{
    res.render('admin/edit',{
      page:page
    })
  })
});

//update the edited page
router.post('/edit/:slug',(req,res)=>{

  let title= req.body.title;
  let slug;
  if(req.body.slug==""){
    slug= req.body.title.replace(/\s+/g,'-').toLowerCase();
  }
  else {
    slug= req.body.slug.replace(/\s+/g,'-').toLowerCase();
  }
  let content= req.body.content;
      pages.findById(req.body.id)
      .then((page)=>{
        console.log(page);
        page.title= title;
        page.content= content;
        page.slug= slug;
        page.save()
        .then(()=>{
          pages.find({})
          .sort({sorting:1})
          .then((page)=>{
            req.app.locals.pages=page;
          });
          req.flash('success_msg','Page Edited sucessfully')
          res.redirect('/admin/pages');
        })
      })
      .catch((err)=>{
        console.log(err);
      });
});


router.get('/delete/:id',(req,res)=>{
    pages.findOneAndRemove({_id:req.params.id})
    .then(()=>{
      pages.find({})
      .sort({sorting:1})
      .then((page)=>{
        req.app.locals.pages=page;
      });
      res.redirect('/admin/pages');
    });
});



module.exports= router;
