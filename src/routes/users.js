var express = require('express');
const app =express();
var router = express.Router();
var empModel=require('../models/employee');
var uplImg=require('../models/fileupload');
var multer  = require('multer')
var path=require('path')
// router.use(express.static('./src/public/uploads'))


// const upldimg=path.join(__dirname, './public/uploads');

//store image in uploads folder
var Storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./src/public/uploads')},
    filename: (req, file, cb) =>{
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
    }
  })
var upload =multer({
    storage:Storage
}).single('file');

// console.log(upload);
// router.get('/',(req,res,next)=>{
//     res.send("This is webtute users")
//         })

router.get('/upload_image', async (req,res,next)=>{
    try{
        const getImg= await uplImg.find().lean();
        console.log(getImg)
        res.render('upload_image', { title: 'upload image',dspImg:getImg,success:'' });
        
    }
    catch(e){
        res.status(400).send(e);
    }
      
    });

router.get('/register',(req,res)=>{
    res.render('index')
})
router.get('/upload', (req,res)=>{
    res.render('upload_image',{title:'image upload',success:''})
})
router.post('/upload',upload,async (req,res,next)=>{
    imgFile=req.file.filename;
    var filuplod=req.file.filename+" uploaded successfully"
    var imgdetails=new uplImg({
        file:imgFile
    })
    const createUser =await imgdetails.save();
    // console.log("create user"+ createUser);
    const getImg= await uplImg.find().lean();
    console.log(getImg)
    res.render('upload_image', { title: 'dispimg',dspImg:getImg,success:filuplod });
    })
module.exports = router;