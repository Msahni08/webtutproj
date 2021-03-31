const express =require('express');
const app =express();
require('./db/conn');
require('./models/employee');
const port=process.env.PORT || 3000
const path = require('path');
app.use(express.static('./public'))
const path1=path.join(__dirname, 'views');


const hbs=require('hbs')
const { registerPartials }=require('hbs')
const partialsPath=path.join(__dirname,'./views/partials')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const joinRouter = require('./routes/joints');
const passmanage = require('./routes/passmanagement');


app.use(express.urlencoded({ extended: false }));

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




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/joints', joinRouter);
app.use('/passmanagement', passmanage);




app.set('views',path1 );
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.listen(port,()=>{
    console.log(`server running on port no ${port}`)
})