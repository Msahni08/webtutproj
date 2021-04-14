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

router.put('/updateCategory/:_id',async (req,res)=>{
    try{
        var updateId=req.params._id;
        var category=req.body.passcat

        categoryData= await passcatgr.findById(updateId)
        categoryData.passcatb=category?category:categoryData.passcatb;
        categoryData.save();
        res.send('Update category successfull '+categoryData.passcatb)
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
        res.send('Update category successfull '+categoryData.passcatb)
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
        res.send('Deleted category successfull '+categoryData.passcatb)
    }
    catch(err){
        res.send(err)
    }


})

module.exports=router