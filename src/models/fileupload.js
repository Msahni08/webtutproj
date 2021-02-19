const mongoose=require('mongoose')
const validator =require('validator')

const uploadImg=mongoose.Schema({
     
    file:{type:String,required:true},
})

const imgUpload = new mongoose.model('UploadImg',uploadImg);
module.exports=imgUpload;