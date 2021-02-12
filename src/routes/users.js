var express = require('express');
var router = express.Router();
var empModel=require('../models/employee');



// router.get('/',(req,res,next)=>{
//     res.send("This is webtute users")
//         })

router.get('/',async (req,res,next)=>{
       res.send("this is webtut user page")
    });

router.get('/register',(req,res)=>{
    res.render('index')
})

module.exports = router;