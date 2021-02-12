const mongoose=require('mongoose')
const validator =require('validator')


const employeeschema=mongoose.Schema({
    name:{type:String,required:true},
    mobile:{type:Number,required:true},
    email:{type:String,required:true},   
    address:{type:String,required:true},
    age:{type:Number,required:true},
    gender:{type:String},
    password:{type:String,required:true},
    cpassword:{type:String,required:true}   

})

const Employee = new mongoose.model('employee',employeeschema);
module.exports=Employee;