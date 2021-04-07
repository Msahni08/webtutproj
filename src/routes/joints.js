var express = require('express');
var router = express.Router();
var sendpss =require('../models/add_pass')
var passcatgr=require('../models/pass_category');
var bootstrapSearch =require('../models/bootstrap_search')

var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
//==============================================================================================================
function checklogin(req,res,next){
  
  // var myToken =localStorage.getItem('userToken')
      try {
        var sess=req.session
        var myToken =localStorage.getItem('userToken')
        if(sess.mobile){
          
          var decoded = jwt.verify(myToken, 'LoginToken');
        }else{
          res.redirect('/login')
        }
          // var decoded = jwt.verify(myToken, 'LoginToken');
      } catch(err) {
          res.status(404).send(err)
        }
        next();
  }
//==============================================================================================================

router.get('/',checklogin,async(req,res)=>{

  // loginUser=localStorage.getItem('userlogin')
  // proimge=localStorage.getItem('proimg')
           var sess=req.session
          var loginUser=sess.mobile;
          var proimage= sess.proimg; 
        if(loginUser){
         try{
                joinpass= await sendpss.aggregate([
                    {
                        $lookup:
                            {
                            from:'password_categories',
                            localField:'addPassword',
                            foreignField:'passcatb',
                            as:'pass_cat_details'
                            }
                    },{ $unwind:"$pass_cat_details"}]
                ).exec()
                console.log(joinpass);
                // res.send(joinpass);
                res.render('joints/joints',{propic:proimage,logMob:loginUser,joinsDetails:joinpass})
         }
         catch(err){
                res.send(err)
         }
        }else{
            res.redirect('/login')
        }
})
//==============================================================================================================

// fetch bootstrap table data from database
router.get('/get_bootstap_data',async (req,res)=>{
  // loginUser=localStorage.getItem('userlogin')
  // proimge=localStorage.getItem('proimg')
           var sess=req.session
          var loginUser=sess.mobile;
          var proimage= sess.proimg; 
     if(loginUser){
      try{
        const bootstrap_Srch= await bootstrapSearch.find().lean()
        res.render('bootstrap_search',{propic:proimage,logMob:loginUser,getbootsearchdata:bootstrap_Srch,success:''})
      }
      catch(err){
        res.send(status)
      }
     }else{
      res.redirect('/login')
     }
      
  
})
//=============================================================================================================
//send data to database
router.post('/post_bootstap_data',async (req,res)=>{
  // loginUser=localStorage.getItem('userlogin')
  // proimge=localStorage.getItem('proimg')
  var sess=req.session
  var loginUser=sess.mobile;
  var proimage= sess.proimg;
  if(loginUser){
    var postdata= new bootstrapSearch({
      name:req.body.Name,
      position:req.body.Position,
      Office:req.body.Office ,
      Age:req.body.Age,
      StartDate:req.body.StartDate,
      Salary:req.body.Salary
    })
    console.log("postdata "+postdata);

    var postDataToDatabade = await postdata.save();
    console.log("postDataToDatabade "+postDataToDatabade);
  const bootstrap_Srch= await bootstrapSearch.find().lean()
    res.render('bootstrap_search',{getbootsearchdata:bootstrap_Srch,propic:proimage,success:"Data Added Successfully"})

  }else{
    res.redirect('/login')
  }
      
})


module.exports = router;
