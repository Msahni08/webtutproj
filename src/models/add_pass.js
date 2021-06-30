const mongoose=require('mongoose')
const validator =require('validator')


const PassAdd=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    addPassword :{
        type:mongoose.Schema.Types.ObjectId,ref:'Password_category',
        required:true
        },

        projtname :{
            type:String,
            required:true
            },
    editor:{
        type:String,
        required:true
        },
    Date:{
        type:Date,
        default:Date.now    
    }
})

const AddPassword = new mongoose.model('PassDetails',PassAdd);
module.exports=AddPassword;