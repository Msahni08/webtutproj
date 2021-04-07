var express = require('express');
var router = express.Router();
var passcatgr=require('../models/pass_category');
// var sendpss =require('../models/add_pass')




router.get('/',(req,res)=>{
    res.send("this is add category api");
})

router.get('/getCategory', async (req,res)=>{
    try{
        var getpass= await passcatgr.find({},{'passcatb':1,'_id':0})
        res.send(getpass)
        console.log(getpass)
    }
    catch(err){
        res.send(err)
    }
   
})

router.post('/sendCategory',async (req,res)=>{
 try{
        var sndcategory=req.body.passcat;
        var passdetails =new passcatgr({
            passcatb:sndcategory
        })
        const passcatgry= await passdetails.save();
        res.send('data send successfully')
 }
 catch(err){
        res.send(err);
 }
})

module.exports=router