const express= require('express');
const router=express.Router();
//get admin index
router.get('/',(req,res)=>{
    res.send('admin');
});


//get add page
router.get('/add-page',(req,res)=>{
    res.render('admin/addpage');
});

module.exports= router;
