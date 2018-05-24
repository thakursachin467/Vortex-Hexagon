const express= require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const database= require('./database/connect');



var app= express();
var port= process.env.PORT || 3000;

//middlewares start here
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('server is up');
});






//database connection and port are started here
database.connectdatabase();
app.listen(port,()=>{
  console.log(`server started at port ${port}`);
})
