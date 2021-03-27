var express = require('express');
var router = express.Router();
const hbs=require('hbs');
const { data } = require('jquery');
var empModel=require('../models/employee');
var bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
var multer  = require('multer')
var path=require('path')


// const { body, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
//=====================================================================
// for storage for file upload
  var Storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./src/public/uploads/profile_image')},
    filename: (req, file, cb) =>{
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
    }
  })
var upload =multer({
    storage:Storage
}).single('profileImg');
//=======================================================================


router.get('/' ,async (req,res)=>{
    try{
        loginUser=localStorage.getItem('userlogin')
        proimge=localStorage.getItem('proimg')
    const empData= await empModel.find().lean();
        proimg=empData.profileImg
        console.log("profile img1 "+proimg)
        console.log("profile img2 "+empData.profileImg)

    res.render('', {propic:proimge, title: 'this is hbs template engine',emprecd:empData ,logMob:loginUser,profimg:proimg});
    }
    catch(err){
        res.status(404).send(err)
    }
})


router.get('/registers',(req,res)=>{
    loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')
     loginIdToken=localStorage.getItem('userToken')
      if(loginIdToken){
        res.redirect('/');
      }else{
        res.render('registers')
      }
  })

  router.get('/login',async(req,res)=>{
    var myToken =localStorage.getItem('userToken')
    loginUser=localStorage.getItem('userlogin')
    if(loginUser){
    const empData= await empModel.find().lean();
    res.render('',{emprecd:empData})
    }
    else{
      res.render('login')
    }
  }) 

//   router.get('/partial',async(req,res)=>{
//     // localStorage.setItem('userToken', token);3
//     localStorage.setItem('userlogin', Mobi);
//     // const empData= await empModel.find().lean();
//     if(myToken){
//     res.render('partials/nav',{mobi_no:Mobi,usrtok:token})
//     }
//     else{
//       res.render('login')
//     }
//   }) 

  router.post('/login',async (req,res)=>{
    // const empPass= empModel.find().lean();
    try{
      var Mobi =req.body.mobile;
      var Pass= req.body.password;
     var empmob= await empModel.findOne({mobile:Mobi});
     var empmo=empmob.password;
     var profimg=empmob.profileImg

     //compare bcrypted password
     var byt =bcrypt.compareSync(Pass,empmo);
    
      if(byt){
        var getuserId=empmo._id
        var token = jwt.sign({userid: getuserId }, 'LoginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('userlogin', Mobi);
        localStorage.setItem('proimg', profimg);


       loginUser=localStorage.getItem('userlogin')
       proimge=localStorage.getItem('proimg')
        console.log("Profile img "+proimge)
        const empData= await empModel.find().lean();
        res.status(201).render('home', { propic:proimge,logMob:loginUser,emprecd:empData});
      }
      else{
        res.status(404).render("login",{success:'Invalid Mobile Number or password'});
      }
    }
    catch(err){
      res.render('login',{success:'Kindly Enter Valid Mobile Number'})
    }
 
}) 
router.post('/search', async (req,res)=>{
    var fltrName=req.body.fltrname;
    var fltrEmail=req.body.fltremail;
    var fltrMobile=req.body.fltrmobile;

    if(fltrName !='' && fltrEmail !='' && fltrMobile !=''){
        var fltrParameter={
            $and:[{name:fltrName},
            {$and:[{email:fltrEmail},{mobile:fltrMobile}]} ]
        }
    }else if(fltrName !='' && fltrEmail=='' && fltrMobile !=''){
        var fltrParameter={
            $and:[{name:fltrName},{mobile:fltrMobile}]
            }
        }else if(fltrName=='' && fltrEmail !='' && fltrMobile !=''){
            var fltrParameter={
                $and:[{email:fltrEmail},{mobile:fltrMobile}]
                }
        }else if(fltrName !='' && fltrEmail !='' && fltrMobile==''){
            var fltrParameter={
                $and:[{name:fltrName},{email:fltrEmail}]
                }
        }else if(fltrName !='' && fltrEmail =='' && fltrMobile==''){
                var fltrParameter={
                    $and:[{name:fltrName}]
                    }
        }else if(fltrName =='' && fltrEmail !=='' && fltrMobile==''){
            var fltrParameter={
                $and:[{email:fltrEmail}]
                }
        }else if(fltrName =='' && fltrEmail =='' && fltrMobile !==''){
            var fltrParameter={
                $and:[{mobile:fltrMobile}]
                }
        }
         else{
            var fltrParameter={}
         }       
                // other method
        //  var empFilter=empModel.find(fltrParameter);
        //  empFilter.exec(function(err,data){
        //      if(err)throw err;
        //      res.render('index',{title:'employee recods',emprecd:data})
        //  })
    const empFilter= await empModel.find(fltrParameter).lean();
    res.render('index', { title: 'this is hbs template engine',emprecd:empFilter,success:'' });
    
})

router.get('/logout',(req,res)=>{
    localStorage.removeItem('userToken');
    localStorage.removeItem('userlogin')
    localStorage.removeItem('proimg')


    res.redirect('/');
}) 

router.get('/delete/:_id', async (req,res,next)=>{
    try{
    var id= req.params._id;   
        var del= await empModel.findByIdAndDelete(id).lean();
        const empData= await empModel.find().lean();
        // res.redirect('/', { title: 'deleted',emprecd:empData,success:'Records Deleted successfully' });
         res.redirect('/');
    }
    catch(e){
        res.status(40).send(e);
    }
    })
   
    router.get('/edit/:_id', async (req,res,next)=>{
    proimge=localStorage.getItem('proimg')

        var id= req.params._id;   
            var edt= await empModel.findById(id).lean();
            res.render('edit', {propic:proimge, title: 'Edit page',emprecd:edt });
          

        })
    router.post('/update', async (req,res,next)=>{   
    proimge=localStorage.getItem('proimg')

                var edt= await empModel.findByIdAndUpdate(req.body.id,{
                    name:req.body.name,
                    mobile:req.body.mobile,
                    email:req.body.email,
                    address:req.body.address,
                    age:req.body.age,
                    gender:req.body.gender,
                    password:req.body.password,
                    cpassword:req.body.cpassword,
                    
                }).lean();
                const empData= await empModel.find().lean();
                // res.render('index', { title: 'Update page',emprecd:empData,success:'Records updated successfully' });
                res.redirect('/')
                next();
     })     
   //middleware for check mobile
   function checkMobile(req,res,next){
    var Mob=req.body.mobile,
    checkexistmob= empModel.findOne({mobile:Mob});
    checkexistmob.exec((err,data)=>{
        if(err) throw err
        if(data){
           return res.render('registers', {success:'Mobile number is already exist' });

        }
        next();
    })

    }       
    
    //middleware for check Email
   function checkEmail(req,res,next){
    var Email=req.body.email,
    checkexisEmail= empModel.findOne({email:Email});
    checkexisEmail.exec((err,data)=>{
        if(err) throw err
        if(data){
           return res.render('registers', {success:'Email id is already exist' });

        }
        next();
    })

    }        

    //registration Form post
router.post('/',checkMobile,checkEmail,upload,async (req,res)=>{
    try{
       const pass=req.body.password
       const cpass=req.body.cpassword
       if(pass==cpass){
           bcyppass =bcrypt.hashSync(pass,10);
           bcypcpass =bcrypt.hashSync(cpass,10);
        const emp =new empModel( 
            {
            name:req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            address:req.body.address,
            age: req.body.age,
            gender:req.body.gender,
            profileImg:req.file.filename,
            password:bcyppass,
            cpassword:bcypcpass ,
            
            }    
        );
        console.log("data sent to database "+emp)
        const createEmp =await emp.save();
        console.log(createEmp)
        res.render('registers',{success:'records insterted succefully'})

        }
        else{
            return res.render('registers', {success:'password and confirm password doesnt match' });

        }
    }
    catch(error){
        res.status(404).send(error);
    }
    
})

module.exports = router;