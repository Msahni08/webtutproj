const mongoose=require('mongoose')
const validator =require('validator')

const bootstrpSchema=mongoose.Schema({
    Name:String,
    Position :String,
    Office :String,   
    Age:Number,
    StartDate:String,
    Salary :String,
})
console.log(bootstrpSchema)
const boot_search = new mongoose.model('bootstrap_search',bootstrpSchema);
console.log(boot_search)
module.exports=boot_search;