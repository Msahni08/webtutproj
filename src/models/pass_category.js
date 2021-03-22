const { data } = require('jquery');
const mongoose=require('mongoose')
const validator =require('validator')


const PassCategory=mongoose.Schema({
    passcatb :{type:String,required:true},
    Date:{
        type:Date,
        default:Date.now    
    }
})

const PassCatename = new mongoose.model('Password_category',PassCategory);
module.exports=PassCatename;