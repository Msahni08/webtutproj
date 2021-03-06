const mongoose=require('mongoose')
const validator =require('validator')


const angurlarschema=mongoose.Schema({
    name:{type:String,required:true},
    mobile:{type:Number,required:true,unique:true},
    email:{type:String,required:true,unique:true},   
    address:{type:String,required:true},
    age:{type:Number,required:true},
    gender:{type:String},
    // profileImg: {type: String, required: true },
    password:{type:String,required:true},
    cpassword:{type:String,required:true},  
    
    date:{
        type:Date,
        default:Date.now
        } 

})

const AngularModel = new mongoose.model('angulardata',angurlarschema);
module.exports=AngularModel;