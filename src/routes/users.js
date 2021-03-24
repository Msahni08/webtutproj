var express = require('express');
var router = express.Router();
var empModel=require('../models/employee');
var uplImg=require('../models/fileupload');
var multer  = require('multer')
var path=require('path')
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

// fndcategory=passcatgr.find({});
// Handlebars=require('handlebars')
// var paginate = require('handlebars-paginate');
// Handlebars.registerHelper('paginate', paginate);

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
 
 

  router.get('/login2',async(req,res)=>{
    var myToken =localStorage.getItem('userToken')
    const empData= await empModel.find().lean();
    if(myToken){
    res.render('dashboard')
    }
    else{
      res.render('login')
    }
  }) 

 
router.get('/logout2',(req,res)=>{
  localStorage.removeItem('userToken');
  localStorage.removeItem('userlogin')

  res.render('dashboard');
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

//  router.get('/passManagement',async (req,res)=>{
//   loginUser=localStorage.getItem('userlogin')
//   if(loginUser){
//    var perPage=1;
//    var page=req.params.page || 1;
//    fndcategory.skip((perPage*page)-perPage)
//             .limit(perPage).exec((err,count)=>{
//               if(error) throw error;
//                passcatgr.countDocuments({}).exec((err,count)=>{
//                 res.render('password_managment',{records:data,
                  
//                   current:page,
//                   pages:Math.ceil(count/perPage)})
           
//             })
//   })
// }
//   else{
//     res.send('login first')
//   }
//  })

 

  

 
//  router.post('/Add-New-Password',checklogin,async (req,res)=>{
  
//   try{
//     loginUser=localStorage.getItem('userlogin')
//     loginIdToken=localStorage.getItem('userToken')
//         selctcatgry=req.body.addPassword
//         passdetls=req.body.editor
//         projdtl=req.body.projtname

//        const sendpass = new sendpss({
//         addPassword:selctcatgry,
//         projtname:projdtl,
//         editor:passdetls,
//        })
//        const sendpassdetls= await sendpass.save();
//        console.log(sendpassdetls)
//        getpass= await passcatgr.find().lean()
//        res.render('Add-New-Password',{data:getpass,logMob:loginUser,success:"password details send successfully"})
//   }
//   catch(err){
//     res.send(err);
//   }
//  })



module.exports = router;