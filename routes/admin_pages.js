const express= require('express');
const router=express.Router();
//get admin index
router.get('/',(req,res)=>{
    res.send('admin');
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
})

module.exports= router;
