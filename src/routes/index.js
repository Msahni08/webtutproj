var express = require('express');
var router = express.Router();
const hbs=require('hbs');
const { data } = require('jquery');
var empModel=require('../models/employee');
var bcrypt=require('bcryptjs')


router.get('/' ,async (req,res)=>{
    try{
        loginUser=localStorage.getItem('userlogin')
    const empData= await empModel.find().lean();

    res.render('index', { title: 'this is hbs template engine',emprecd:empData ,logMob:loginUser});
    }
    catch(err){
        res.status(404).send(err)
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
        var id= req.params._id;   
            var edt= await empModel.findById(id).lean();
            res.render('edit', { title: 'Edit page',emprecd:edt });
          

        })
    router.post('/update', async (req,res,next)=>{   
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

router.post('/',checkMobile,checkEmail,async (req,res)=>{
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
            password:bcyppass,
            cpassword:bcypcpass ,
            }    
        );
        console.log("data sent to database "+emp)
        const createEmp =await emp.save();
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