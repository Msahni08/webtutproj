var express = require('express');
var router = express.Router();
const hbs=require('hbs')
var empModel=require('../models/employee');

// const { registerPartials }=require('hbs');
// var path = require('path');
// var partialsPath=path.join(__dirname,'views/partials');
// hbs.registerPartials(partialsPath);
// var studentModel=require('../models/employee');


router.get('/',async (req,res)=>{
    try{
    const empData= await empModel.find().lean();
    res.render('index', { title: 'this is hbs template engine',emprecd:empData });
    }
    catch(err){
        res.status(404).send(err)
    }
})
router.post('/',async (req,res)=>{
    try{
       const pass=req.body.password
       const cpass=req.body.cpassword
       if(pass==cpass){
        const emp =new empModel(req.body);
        console.log("the success "+emp)
        const createEmp =await emp.save(async (req,res1)=>{
            try{
                const empData= await empModel.find().lean();
                res.render('index', { title: 'this is hbs template engine',emprecd:empData });
            }
            catch(e){
                res.send(e);
                }
        
        });
        console.log("the page part "+ createEmp);
        // res.status(201).render('index');
        }
        else{
            res.send("pass and cpass doesn't match")
        }
    }
    catch(error){
        res.status(404).send(error);
    }
    
})

module.exports = router;