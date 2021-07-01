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
                password:bcyppass,
                cpassword:bcypcpass ,
                
                }    
            );
            console.log("data sent to database "+angdata)
            const createang =await angdata.save();
            console.log(createang)
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