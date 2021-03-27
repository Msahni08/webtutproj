var express = require('express');
var router = express.Router();
var passcatgr=require('../models/pass_category');
var sendpss =require('../models/add_pass')
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

function checklogin(req,res,next){
  var myToken =localStorage.getItem('userToken')
    try {
        var decoded = jwt.verify(myToken, 'LoginToken');
      } catch(err) {
        res.redirect('login')
      }
      next();
}
  // =============================================================================

router.get('/',checklogin,async(req,res)=>{
  loginUser=localStorage.getItem('userlogin')
  proimge=localStorage.getItem('proimg')

  if(loginUser){
    try{
      
        res.render('passwordManagment/dashboard',{propic:proimge,logMob:loginUser})
    }catch(err){
        res.send(err)
    }
  }
  else{
    res.render('/login',{success:'Need to login first'})
  }
})
  // =============================================================================

router.get('/Add-New-Password',checklogin, async (req,res)=>{
    loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

  if(loginUser){
    try{
      getpass= await passcatgr.find().lean()
      res.render('passwordManagment/Add-New-Password',{propic:proimge,data:getpass,logMob:loginUser,success:''})
    }
    catch(err){
      res.send(err)
    }
   
  }else{
    res.render('/login',{success:'Need to login first'})
  }
  })
  // =============================================================================

  router.get('/AddNewCategory',checklogin,async (req,res)=>{
    loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

    try{
        if(loginUser){
        res.render('passwordManagment/Add-New-Category',{propic:proimge,logMob:loginUser,title:'add new category',errors:''})
        }else{
          res.render('/login',{success:'Need to login first'})
        }
       }
       catch(err){
        res.status(404).send(err)
       }
  })
   

  // =============================================================================
  router.post('/AddNewCategory',checklogin,[ body('passcat','please inter password category name').isLength({ min: 1 }),],async (req,res)=>{
    loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

    const errors = validationResult(req);
    if(loginUser){
    try{
  
          if (!errors.isEmpty()) {
            console.log(errors.mapped());
            res.render('passwordManagment/Add-New-Category',{propic:proimge,title:'add new category',logMob:loginUser,errors:errors.mapped()})
          }
          else{
              
                var passdetails =new passcatgr({
                passcatb:req.body.passcat 
                })
  
                const passcatgry= await passdetails.save();
                console.log(passcatgry)
                res.render('passwordManagment/Add-New-Category',{propic:proimge,title:'add new category',logMob:loginUser,loginuser:loginUser,success:'Password category inserted successfully'})
              }
      }
        catch(err){
          res.status(404).send(err)
        }
    }else{
      res.render('/login',{success:'Need to login first'})

    }
 })
  
//=================================================================================================================

    router.post('/Add-New-Password',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
      loginIdToken=localStorage.getItem('userToken')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
          try{
            
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
              res.render('passwordManagment/Add-New-Password',{propic:proimge,data:getpass,logMob:loginUser,success:"password details send successfully"})
          }
          catch(err){
            res.send(err);
          }
        }else{
            res.render('/login',{success:'Need to login first'})

        }
     })
    
//=================================================================================================================


    router.get('/view-all-category',checklogin, async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
       try{
        // let page =1 //page number
        // let limit=5
        getpass= await passcatgr.find().lean()
        // .skip((page-1)*limit)
        // .select('passcatb').limit(limit)
        // console.log(getpass)
        res.render('passwordManagment/view-all-category',{propic:proimge,logMob:loginUser,title:'password category page',data:getpass,success:''})
    
       }
       catch(err){
        res.send(err)
       }
      }
      else{
        res.render('/login',{success:'Need to login first'})

      }
     })
//=================================================================================================================
    
    
     router.get('/View-All-Password',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
          try{
                
            var getpassdtl= await sendpss.find().lean()
            res.render('passwordManagment/View-All-Password',{propic:proimge,logMob:loginUser,getpassdl:getpassdtl,success:'' });
            }
          catch{
            res.send(err)
          }
        }
        })
//=================================================================================================================
    
     router.get('/deletepass/:_id',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
        try{
          var id= req.params._id;   
              var del= await sendpss.findByIdAndDelete(id).lean();
              const findcat= await sendpss.find().lean();
              res.render('passwordManagment/View-All-Password',{propic:proimge,logMob:loginUser,getpassdl:findcat,success:'Data Deleted Successfully'})
              
          }
          catch(e){
              res.status(40).send(e);
          }
          }
          else{
            res.render('/login',{success:'Need to login first'})
    
          }  
        })
//=================================================================================================================

     router.get('/deleteCategory/:_id',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
        try{
          var id= req.params._id;   
              var del= await passcatgr.findByIdAndDelete(id).lean();
              const findcat= await passcatgr.find().lean();
              res.render('passwordManagment/view-all-category',{propic:proimge,logMob:loginUser,data:findcat,success:'Data Deleted Successfully'})
              
          }
          catch(e){
              res.status(40).send(e);
          }
          }
       else{
            res.render('/login',{success:'Need to login first'})
    
          }     
        }
     )
//=================================================================================================================
    
     router.get('/edit/:_id',checklogin, async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

    if(loginUser){
      try{
          var id= req.params._id;   
              var editcat= await passcatgr.findById(id).lean();
              res.render('passwordManagment/editPasscat', {propic:proimge,logMob:loginUser, title: 'Edit page',editpass:editcat });
       }catch(e){
          res.send(e)
       }
        
    }else{
            res.render('/login',{success:'Need to login first'})
    
          }  
      })
//=================================================================================================================
    
      router.post('/updatecatg',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
    proimge=localStorage.getItem('proimg')

        if(loginUser){
          try{ 
            var updatecat= await passcatgr.findByIdAndUpdate(req.body.id,{
              passcatb:req.body.passcat
            }).lean();
            getpass= await passcatgr.find().lean()
            res.render('passwordManagment/view-all-category',{propic:proimge,logMob:loginUser,data:getpass,success:'Data Update Successfully'})
            
          }
          catch(err){
              res.send(err)
          }
        }else{
          res.render('/login',{success:'Need to login first'})
  
        }   
         
        })
     
//=================================================================================================================
    
    
     router.get('/dashboard',checklogin,async (req,res)=>{

      loginUser=localStorage.getItem('userlogin')
      loginIdToken=localStorage.getItem('userToken')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
        try{
              res.render('dashboard',{logMob:loginUser})
        }
        catch(err){
          res.send(err)
        }}
        else{
          res.render('/login',{propic:proimge,logMob:loginUser,success:'Need to login first'})
  
        }   
     })
//=================================================================================================================

     router.get('/editpass/:_id',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
      loginIdToken=localStorage.getItem('userToken')
    proimge=localStorage.getItem('proimg')

      if(loginUser){
          try{
            
            var id= req.params._id; 
            var getpassdtl= await passcatgr.find().lean();
            var editpassword= await sendpss.findById(id).lean();
            res.render('passwordManagment/passupdate',{propic:proimge,editpas:editpassword,logMob:loginUser,data:getpassdtl})
          
          } 
          catch(err){
            res.send(err)
          }}
       else{
            res.render('/login',{success:'Need to login first'})
    
          }   
    })
//=================================================================================================================
    
     router.post('/updateckeditpass',checklogin,async (req,res)=>{
      loginUser=localStorage.getItem('userlogin')
      loginIdToken=localStorage.getItem('userToken')
    proimge=localStorage.getItem('proimg')

    if(loginUser){
      try{ 
        var updatepass= await sendpss.findByIdAndUpdate(req.body.id,{
          addPassword:req.body.addPassword,
          projtname:req.body.projtname,
          editor:req.body.editor
          }).lean();
          console.log(updatepass)
         var getpass= await sendpss.find().lean()
        //  console.log(getpass)

        res.render('passwordManagment/View-All-Password',{propic:proimge,getpassdl:getpass,logMob:loginUser,success:'Data Update Successfully'})
        
      }
      catch(err){
          res.send(err)
          console.log(err)
      }}
      else{
        res.render('/login',{success:'Need to login first'})

      }   
     })
//=================================================================================================================

   

module.exports = router;