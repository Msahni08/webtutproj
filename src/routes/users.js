var express = require('express');
var router = express.Router();
var empModel=require('../models/employee');
var uplImg=require('../models/fileupload');
var multer  = require('multer')
var path=require('path')
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
// app.use('/bootstrap',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/")))

// router.use(express.static('./src/public/uploads'))


// const upldimg=path.join(__dirname, './public/uploads');

//store image in uploads folder
var Storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./src/public/uploads')},
    filename: (req, file, cb) =>{
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
    }
  })
var upload =multer({
    storage:Storage
}).single('file');

// console.log(upload);
// router.get('/',(req,res,next)=>{
//     res.send("This is webtute users")
//         })

router.get('/upload_image', async (req,res,next)=>{
    try{
        const getImg= await uplImg.find().lean();
        console.log(getImg)
        res.render('upload_image', { title: 'upload image',dspImg:getImg,success:'' });
        
    }
    catch(e){
        res.status(400).send(e);
    }
      
    });

router.get('/registers',checklogin,(req,res)=>{
  loginUser=localStorage.getItem('userlogin')
   loginIdToken=localStorage.getItem('userToken')
    if(loginUser){
      res.redirect('/');
    }else{
      res.render('register')
    }
})
router.get('/upload', (req,res)=>{
    res.render('upload_image',{title:'image upload',success:''})
})
router.post('/upload',upload,async (req,res,next)=>{
    imgFile=req.file.filename;
    var filuplod=req.file.filename+" uploaded successfully"
    var imgdetails=new uplImg({
        file:imgFile
    })
    const createUser =await imgdetails.save();
    // console.log("create user"+ createUser);
    const getImg= await uplImg.find().lean();
    console.log(getImg)
    res.render('upload_image', { title: 'dispimg',dspImg:getImg,success:filuplod });
    })
// Get Home page
    router.get('/home',(req,res)=>{
        res.redirect('/')
    })

    //middleware for check login
    function checklogin(req,res,next){
      var myToken =localStorage.getItem('userToken')
        try {
            var decoded = jwt.verify(myToken, 'LoginToken');
          } catch(err) {
            res.redirect('login')
          }
          next();
    }
 
  router.get('/login',async(req,res)=>{
    var myToken =localStorage.getItem('userToken')
    const empData= await empModel.find().lean();
    if(myToken){
    res.render('managePass',{emprecd:empData})
    }
    else{
      res.render('login')
    }
  })  

  router.post('/login',async (req,res)=>{
    // const empPass= empModel.find().lean();
    try{
      var Mobi =req.body.mobile;
      var Pass= req.body.password;
     var empmob= await empModel.findOne({mobile:Mobi});
     var empmo=empmob.password;

     //compare bcrypted password
     var byt =bcrypt.compareSync(Pass,empmo);
    
      if(byt){
        var getuserId=empmo._id
        var token = jwt.sign({userid: getuserId }, 'LoginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('userlogin', Mobi);

        const empData= await empModel.find().lean();
        res.status(201).render('managePass', { emprecd:empData});
      }
      else{
        res.status(404).render("login",{success:'Invalid Mobile Number or password'});
      }
    }
    catch(err){
      res.render('login',{success:'Kindly Enter Valid Mobile Number'})
    }
 
}) 
  router.get('/logout',(req,res)=>{
    localStorage.removeItem('userToken');
    localStorage.removeItem('userlogin')

    res.redirect('/');
}) 
  

 router.get('/mypage',checklogin,(req,res)=>{
   loginUser=localStorage.getItem('userlogin')
   loginIdToken=localStorage.getItem('userToken')

   if(loginUser){
   res.render('myPage',{logMob:loginUser,logID:loginIdToken});
   }
   else{
     res.redirect('login')
   }
 }) 

module.exports = router;