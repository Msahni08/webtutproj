const express =require('express');
const app =express();
require('./db/conn');
const port=process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("Hello this is awasom world")
})

app.listen(port,()=>{
    console.log(`server running on port no ${port}`)
})