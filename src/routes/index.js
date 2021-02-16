var express = require('express');
var router = express.Router();
const hbs=require('hbs');
const Employee = require('../models/employee');
var empModel=require('../models/employee');
var empdt=empModel.find({});


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
    var id= req.params._id;   
        var del= await empModel.findByIdAndDelete(id).lean();
        const empData= await empModel.find().lean();
                res.render('index', { title: 'this is hbs template engine',emprecd:empData,success:'Records Deleted successfully' });
    
    })
   
    router.get('/edit/:_id', async (req,res,next)=>{
        var id= req.params._id;   
            var edt= await empModel.findById(id).lean();
            res.render('edit', { title: 'this is hbs template engine',emprecd:edt });
          

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
                res.render('index', { title: 'this is hbs template engine',emprecd:empData,success:'Records updated successfully' });
    
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
                res.render('index', { title: 'this is hbs template engine',emprecd:empData,success:'record inserted succesfully' });
            }
            catch(e){
                res.send(e);
                }
        
        });

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