const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://mymongodb:manzy%40012@mymcluster.ceywf.mongodb.net/MyDataBase?retryWrites=true&w=majority",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
}).then(()=>{
    console.log("connection is successfull");
}).catch((e)=>{
    console.log("no connection");
})