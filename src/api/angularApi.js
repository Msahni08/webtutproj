var express = require('express');
const app =express();
var router = express.Router();
var empModel=require('../models/employee');
var angModel=require('../models/angularModel');
const mongoose=require('mongoose');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
var multer  = require('multer')


  //middleware for check mobile
  function checkMobile(req,res,next){
    var Mob=req.body.mobile,
    checkexistmob= empModel.findOne({mobile:Mob});
    checkexistmob.exec((err,data)=>{
        if(err) throw err
        if(data){
           return res.send('Mobile number is already exist');

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
           return res.send('Email id is already exist');

        }
        next();
    })

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

//----------------------------------------------------------------------
router.get('/userdetails' ,async (req,res)=>{
    try{
          
            // console.log('Mobile no '+loginUser)

            // console.log('profile Image'+proimage)

            // proimge=localStorage.getItem('proimg')
        const userdtls= await angModel.find().lean();
            // proimg=empData.profileImg
        // res.send(userdtls)
            res.status(201).json({
                massage:"Get angular user data",
                results:userdtls
            })
            }
    catch(err){
        res.status(404).send(err)
    }
})

//=======================================================================     
//registration Form post
    router.post('/angular_registration',async (req,res)=>{
        try{
           const pass=req.body.password
           const cpass=req.body.cpassword
           if(pass==cpass){
               bcyppass =bcrypt.hashSync(pass,10);
               bcypcpass =bcrypt.hashSync(cpass,10);
            const angdata =new angModel( 
                {
                name:req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                address:req.body.address,
                age: req.body.age,
                gender:req.body.gender,
                // profileImg:req.file.filename,
                password:bcyppass,
                cpassword:bcypcpass ,
                
                }    
            );
            console.log("data sent to database "+angdata)
            const createang =await angdata.save();
            res.status(201).json({
                massage:"Records send successfully",
                results:createang
            })   
    
            }
            else{
                 res.send('password and confirm password doesnt match');
    
            }
        }
        catch(error){
            res.status(404).send(error);
        }
        
    })
//---------------------------------------------------------------------

router.get('/getusrdataBy_id/:_id',async (req,res)=>{
    try{
        var getdetail_Id=req.params._id;
     console.log("get id: "+getdetail_Id)
        getData= await angModel.findById(getdetail_Id).lean()
        // res.send(getData)
        res.status(201).json({
            massage:"Get angular user data",
            results:getData
        })
    }
    catch(err){
        res.send(err)
    }
    

})
//-------------------------------Delete Method-----------------------------------------

router.delete('/deleteReactiveFormData/:_id',async (req,res)=>{
    try{
        var deleteId=req.params._id;
        // var updateId=req.body._id;  // if request will be received by body
        
        // var category=req.body.passcat
        
        deleteAndGet= await angModel.findByIdAndRemove(deleteId)
        // categoryData.passcatb=category?category:categoryData.passcatb;
        deleteAndGet.save();
        res.status(201).json({
            massage:"Delete Reactive Form Data Successfully",
            results:deleteAndGet
        })
    }
    catch(err){
        res.send(err)
    }
    

})

//--------------------------------------------------------------------------------
    module.exports=router