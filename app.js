const express= require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const database= require('./database/connect');
const pages= require('./routes/pages');
const bodyParser = require('body-parser')
const adminpages= require('./routes/admin_pages');
const admincategories= require('./routes/admin_categories');
const adminproducts= require('./routes/admin_products')
const flash = require('connect-flash');
const path = require('path');
const {check}= require('./helpers/hbs');
const fileUpload= require('express-fileupload');


var app= express();
var port= process.env.PORT || 3000;

app.use('/assests',express.static(path.join(__dirname,'public')));
//middlewares start here

app.engine('handlebars', exphbs({helpers:{
  check:check
},
defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
	cookie : {maxAge:180 * 60  * 1000}
}))

app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(flash());

//global variables
 app.use(function(req,res,next) {

    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.userid=req.user || null;
      next();

});
//fileUpload middlewares
app.use(fileUpload());


//all routes related to user handled here
app.use('/',pages);
//all routes related to admin handled here
app.use('/admin/pages',adminpages);
//all routes to categories start here
app.use('/admin/categories',admincategories);

//all routes to products start here
app.use('/admin/products',adminproducts);






//database connection and port are started here
database.connectdatabase();
app.listen(port,()=>{
  console.log(`server started at port ${port}`);
})
