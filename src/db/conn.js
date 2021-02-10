const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/MyDataBase",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("connection is successfull");
}).catch((e)=>{
    console.log("no connection");
})