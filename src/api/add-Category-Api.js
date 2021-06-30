var express = require('express');
const app =express();
var router = express.Router();
var passcatgr=require('../models/pass_category');
var sendpss =require('../models/add_pass')
var empModel=require('../models/employee');
const mongoose=require('mongoose');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
var multer  = require('multer')




router.get('/',(req,res)=>{
    res.send("this is add category api");
})

router.get('/getCategory', async (req,res)=>{
    try{
        var getpass= await passcatgr.find({},{'passcatb':1,'_id':1})
        // res.send(getpass);
         res.status(201).json({
             "massage":"Get Category Data",
             "Item1":"mobile",
             "massage2":"Get Category Data a131131",
             "Item2":"mobile 46464",
             "results":getpass})
        console.log(getpass)
    }
    catch(err){
        res.send(err)
    }
   
})
router.post('/sendCategory2',async (req,res)=>{
    console.log(req.body.ab)
    
    res.json(req.body.ab)
})

router.post('/sendCategory',async (req,res)=>{
 try{
        var sndcategory=req.body.passcat;
        console.log('body data'+sndcategory)
        var passdetails =new passcatgr({
            passcatb:sndcategory
        })
        const passcatgry= await passdetails.save();
        res.send(passcatgry)

        // res.status(201).json({
        //     massage:"Category send successfully",
        //     results:passcatgry
        // })
 }
 catch(err){
        res.send(err);
 }
})

router.put('/updateCategory/:_id',async (req,res)=>{
    try{
        var updateId=req.params._id;
        var category=req.body.passcat
        
        categoryData= await passcatgr.findById(updateId)
        categoryData.passcatb=category?category:categoryData.passcatb;
        categoryData.save();
        res.status(201).json({
            massage:"Update Category Successfully",
            results:categoryData
        })
    }
    catch(err){
        res.send(err)
    }
    

})
// Note- Difference between Put and patch method is that if we want update only one data even then we have to pass all column data either is will be 1 or 2 or more data
 // whereas in patch method we pass only those data which to be required for update 
router.patch('/updateCategory/:_id',async (req,res)=>{
    try{
        var updateId=req.params._id;
        // var updateId=req.body._id;  // if request will be received by body
        
        var category=req.body.passcat
        
        categoryData= await passcatgr.findById(updateId)
        categoryData.passcatb=category?category:categoryData.passcatb;
        categoryData.save();
        res.status(201).json({
            massage:"Update Category Successfully",
            results:categoryData
        })
    }
    catch(err){
        res.send(err)
    }
    

})

router.delete('/updateCategory/:_id',async (req,res)=>{
    try{
        var updateId=req.params._id;
        // var updateId=req.body._id;  // if request will be received by body
        
        var category=req.body.passcat
        
        categoryData= await passcatgr.findByIdAndRemove(updateId)
        // categoryData.passcatb=category?category:categoryData.passcatb;
        categoryData.save();
        res.status(201).json({
            massage:"Delete Category Successfully",
            results:categoryData
        })
    }
    catch(err){
        res.send(err)
    }
    

})
//get password details by select and populate queries
router.get('/getpassdetails',async (req,res)=>{
    try{
        var getpass = await sendpss
        .find()
        .select("_id addPassword projtname editor Date");
        res.status(201).json({
            message:"Password details",
            results:getpass
        })
    }
    catch(err){
        res.send(err)
    }
})

router.post('/sendpassdetails',async (req,res)=>{
    try{
        selctcatgry=req.body.addPassword
        passdetls=req.body.editor
        projdtl=req.body.projtname

        var sendpass =new sendpss({
            _id:mongoose.Types.ObjectId,
             addPassword:selctcatgry,
             projtname:projdtl,
             editor:passdetls,
        })
        var sendpassdata =await sendpass.save();
        res.status(201).json({
            message:'send data successfully',
            results:sendpassdata
        })
     }
     catch(err){
         res.send(err)
    }
    })

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
//=======================================================================


//registration Form post
    router.post('/register',checkMobile,upload,checkEmail,async (req,res)=>{
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
            res.send('records insterted succefully')
    
            }
            else{
                return res.send('password and confirm password doesnt match');
    
            }
        }
        catch(error){
            res.status(404).send(error);
        }
        
    })
    

module.exports=router