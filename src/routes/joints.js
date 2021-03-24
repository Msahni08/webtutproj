var express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('joints/joints')
})

module.exports = router;
