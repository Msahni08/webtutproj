const mongoose=require('mongoose')
const validator =require('validator')

const uploadImg=mongoose.Schema({
     
    file:{type:String,required:true},
    date:{
        type:Date,
        default:Date.now
        } 
})

const imgUpload = new mongoose.model('UploadImg',uploadImg);
module.exports=imgUpload;