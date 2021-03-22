const mongoose=require('mongoose')
const validator =require('validator')


const PassAdd=mongoose.Schema({
    addPassword :{
        type:String,
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