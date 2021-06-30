const express =require('express');
const app =express();
require('./db/conn');
require('./models/employee');
const port=process.env.PORT || 3000
const path = require('path');
app.use(express.static('./public'))
const path1=path.join(__dirname, 'views');
var session = require('express-session')

const hbs=require('hbs')
const { registerPartials }=require('hbs')
const partialsPath=path.join(__dirname,'./views/partials')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const joinRouter = require('./routes/joints');
const passmanage = require('./routes/passmanagement');
const apirout =require('./api/add-Category-Api');
var session = require('express-session');


app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // for parsing application/json

app.use('/bootstrap',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/")))
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist")))
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")))
app.use('/jqueryUi',express.static(path.join(__dirname,"public/jquery-ui-1.12.1.custom")))
app.use('/font',express.static(path.join(__dirname,"../node_modules/font-awesome")))
app.use('/ckedit',express.static(path.join(__dirname,"../node_modules/ckeditor4")))
app.use('/css',express.static(path.join(__dirname,"public/stylesheet")))
app.use('/upld',express.static(path.join(__dirname,"public/uploads")))
app.use('/profileImg',express.static(path.join(__dirname,"public/uploads/profile_image")))
app.use('/DataTable',express.static(path.join(__dirname,"public/jquery_file_bootstap_search")))
app.use(session({
    secret:'YG*r%4YX`p5Tg_2U',
    resave:'false',
    saveUninitialized:true,
    // cookie: { secure: true }
}))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/joints', joinRouter);
app.use('/passmanagement', passmanage);
app.use('/api',apirout)
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
//     next(); // Important
// })



app.set('views',path1 );
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.listen(port,()=>{
    console.log(`server running on port no ${port}`)
})