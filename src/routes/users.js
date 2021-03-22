var express = require('express');
var router = express.Router();
var empModel=require('../models/employee');
var passcatgr=require('../models/pass_category');
var sendpss =require('../models/add_pass')
var uplImg=require('../models/fileupload');
var multer  = require('multer')
var path=require('path')
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

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

router.get('/registers',(req,res)=>{
  loginUser=localStorage.getItem('userlogin')
   loginIdToken=localStorage.getItem('userToken')
    if(loginIdToken){
      res.redirect('/');
    }else{
      res.render('registers')
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

 router.get('/passManagement',async (req,res)=>{
  loginUser=localStorage.getItem('userlogin')
  if(loginUser){
   try{
    getpass= await passcatgr.find().lean()
    console.log(getpass)
    res.render('password_managment',{title:'password category page',data:getpass,success:''})
   }
   catch(err){

   }
  }
  else{
    res.send('login first')
  }
 })

 router.get('/passManagement/delete/:_id',async (req,res)=>{
  loginUser=localStorage.getItem('userlogin')
  if(loginUser){
    try{
      var id= req.params._id;   
          var del= await passcatgr.findByIdAndDelete(id).lean();
          const empData= await passcatgr.find().lean();
          res.redirect('/users/passManagement')
          
      }
      catch(e){
          res.status(40).send(e);
      }
      }
    }
 )

 router.get('/passManagement/edit/:_id', async (req,res)=>{
  var id= req.params._id;   
      var editcat= await passcatgr.findById(id).lean();
      res.render('editPasscat', { title: 'Edit page',editpass:editcat });
    

  })

  router.post('/updatecatg',async (req,res)=>{
      try{ 
        var updatecat= await passcatgr.findByIdAndUpdate(req.body.id,{
          passcatb:req.body.passcat
        }).lean();
        getpass= await passcatgr.find().lean()
        res.render('password_managment',{data:getpass,success:'Data Update Successfully'})
        
      }
      catch(err){
          res.send(err)
      }
     
    })
 router.get('/AddNewCategory',(req,res)=>{
   res.render('Add-New-Category',{title:'add new category',errors:''})
 })
 router.post('/AddNewCategory',checklogin,[ body('passcat','please inter password category name').isLength({ min: 1 }),],async (req,res)=>{
  loginUser=localStorage.getItem('userlogin')
  const errors = validationResult(req);
  try{

    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      res.render('Add-New-Category',{title:'add new category',loginuser:loginUser,errors:errors.mapped()})
    }
    else{
        
        var passdetails =new passcatgr({
        passcatb:req.body.passcat 
        })

        const passcatgry= await passdetails.save();
        console.log(passcatgry)
        res.render('Add-New-Category',{title:'add new category',logMob:loginUser,loginuser:loginUser,success:'Password category inserted successfully'})
    }
  }
    catch(err){
      res.status(404).send('etc error')
    }
  }
  
)

 router.get('/dashboard',checklogin,(req,res)=>{
  loginUser=localStorage.getItem('userlogin')
  loginIdToken=localStorage.getItem('userToken')
  if(loginUser){
    res.render('dashboard',{logMob:loginUser})
  }
 })

 router.get('/Add-New-Password', async (req,res)=>{
  loginUser=localStorage.getItem('userlogin')
if(loginUser){
  try{
    getpass= await passcatgr.find().lean()
    res.render('Add-New-Password',{data:getpass,logMob:loginUser,success:''})
  }
  catch(err){
    res.send(err)
  }
 
}else{
  res.send('login first')
}
})
 
  

 router.get('/View-All-Password',checklogin,async (req,res)=>{
  loginUser=localStorage.getItem('userlogin')
   try{
    var getpassdtl= await sendpss.find().lean();
    res.render('View-All-Password',{logMob:loginUser,getpassdl:getpassdtl,success:'' });
    res.render()
   }
   catch{

   }
   
 })

 router.post('/AddNewCatogory',checklogin,async (req,res)=>{
  
  try{
    loginUser=localStorage.getItem('userlogin')
    loginIdToken=localStorage.getItem('userToken')
        selctcatgry=req.body.addPassword
        passdetls=req.body.editor
        projdtl=req.body.projtname

       const sendpass = new sendpss({
        addPassword:selctcatgry,
        projtname:projdtl,
        editor:passdetls,
       })
       const sendpassdetls= await sendpass.save();
       console.log(sendpassdetls)
       getpass= await passcatgr.find().lean()
       res.render('Add-New-Password',{data:getpass,logMob:loginUser,success:"password details send successfully"})
  }
  catch(err){
    res.send(err);
  }
 })
 router.get('/paddedit/:_id',checklogin,async (req,res)=>{
  try{
    loginUser=localStorage.getItem('userlogin')
    loginIdToken=localStorage.getItem('userToken')
    var id= req.params._id; 
    var getpassdtl= await passcatgr.find().lean();
    var editpassword= await sendpss.findById(id).lean();
    res.render('passupdate',{editpas:editpassword,data:getpassdtl})
  
  } 
  catch(err){
    res.send(err)
  }
  
})

router.post('/updateckeditpass',checklogin,async (req,res)=>{
  
  try{
    loginUser=localStorage.getItem('userlogin')
    loginIdToken=localStorage.getItem('userToken')
    console.log(loginUser)  ;
    console.log(loginIdToken);  
    var updatepass= await sendpss.findByIdAndUpdate(req.body.id,{
      addPassword :req.body.addPassword,
      projtname :req.body.projtname,
      editor:req.body.editor
    }).lean();

     console.log('update data:-'+updatepass)   
    getpassdtl= await sendpss.find().lean()
    console.log('all view data:-'+getpassdtl)  
       res.render('/View-All-Password',{getpassdl:getpassdtl,logMob:loginUser,success:"password details Update successfully"})
  }
  catch(err){
    res.send("details not updated");
  }
})
module.exports = router;