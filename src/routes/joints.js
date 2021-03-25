var express = require('express');
var router = express.Router();
var sendpss =require('../models/add_pass')
var passcatgr=require('../models/pass_category');
var jwt = require('jsonwebtoken')
var bcrypt=require('bcryptjs')
const { body, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
//==============================================================================================================
function checklogin(req,res,next){
    var myToken =localStorage.getItem('userToken')
      try {
          var decoded = jwt.verify(myToken, 'LoginToken');
        } catch(err) {
          res.redirect('login')
        }
        next();
  }
//==============================================================================================================

router.get('/',checklogin,async(req,res)=>{

    loginUser=localStorage.getItem('userlogin')
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
                res.render('joints/joints',{joinsDetails:joinpass})
         }
         catch(err){
                res.send(err)
         }
        }else{
            res.render('/login',{success:'Need to login first'})
        }
})
//==============================================================================================================

module.exports = router;
