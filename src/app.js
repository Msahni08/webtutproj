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
app.use(express.urlencoded({ extended: false }));

app.use('/bootstrap',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/")))
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist")))
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")))
app.use('/font',express.static(path.join(__dirname,"../node_modules/font-awesome")))
app.use('/css',express.static(path.join(__dirname,"public/stylesheet")))
app.use('/upld',express.static(path.join(__dirname,"public/uploads")))


app.use('/users', usersRouter);
app.use('/', indexRouter);

app.set('views',path1 );
// app.set('partials', path.join(__dirname, 'views/partials'));
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.listen(port,()=>{
    console.log(`server running on port no ${port}`)
})