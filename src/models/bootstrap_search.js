const mongoose=require('mongoose')
const validator =require('validator')

const bootstrpSchema=mongoose.Schema({
    name:String,
    position :String,
    Office :String,   
    Age:Number,
    StartDate:String,
    Salary :String,
})
const boot_search = new mongoose.model('bootsercses',bootstrpSchema);
module.exports=boot_search;