//If this doesn't work, then type in var in front of
//bodyParser, path,expressValidator,and mongoose
var express = require('express'),
//const mongoose = require('mongoose');
 bodyParser = require('body-parser'),
 path = require('path'),
 expressValidator = require('express-validator'),
// mongoose.connection.once('open',function(){
//   console.log('Connection has been made, now make fireworks...');
// }).on('error',function(error){
//   console.log('Connection error');
// });
mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test');

var app = express();

var nameSchema = new mongoose.Schema({
  firstName:String,
  lastname:String,
  Email:String,
  Message:String
});
//The database that your sending the data to is called "User",
//not because of the variable. But because of the "User" in parenthesis
var User = mongoose.model("User",nameSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

/*
var logger = function(req,res,next){
  console.log('Loggin...');
  next();
}

app.use(logger);*/
//======================================
//View Engine
//======================================
var fs = require('fs');
 var myCss = {
  style : fs.readFileSync('public/style.css','utf8')
 };
 //Displays our HTML, and CSS files
app.get('/', function(req,res){
  res.render('index.ejs',{
    myCss: myCss
  });
});

//app.post("/addclient",function(req,res){
//  var body = req.body.firstName;
//});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
//app.use(express.static(__dirname + '/public'));app.use(express.static(__dirname + '/public'));<link href="/css/style.css" rel="stylesheet" type="text/css">

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.')
    ,root = namespace.shift(),
    formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param:formParam,
      msg:msg,
      value:value
    };
  }
}));
//======================================

//Set Static path
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static("public"));

//Global variables
app.use(function(req,res,next){
  res.locals.errors = null;
  next();
});
//======================================
//Routes
//======================================

// app.post('/users/add', function(req,res){
// req.checkBody('first_name','First Name is Required').notEmpty();
// req.checkBody('last_name','Last Name is Required').notEmpty();
// req.checkBody('email','Email is Required').notEmpty();
//
// var errors = req.validationErrors();
// if(errors){
//  res.render('index',{
//    title:'Customers',
//    users:users,
//    errors:errors
//  });
// }else{
//   var newUser={
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email:req.body.email
//   }
//   console.log('Success');
// }
// });
app.post("/addname",(req,res) =>{
  var myData = new User(req.body);
  myData.save()
  .then(item => {
    res.redirect("/");
  })
  .catch(err => {
    res.status(400).send("Unable to save to the database");
  });
});

app.listen(3000,function(){
  console.log('Server started on port 3000...');
});
