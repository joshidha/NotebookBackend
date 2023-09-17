const express=require('express');
const connectDb=require('./Server/Database/connection');
var cors = require('cors')
const app=express();
app.use(cors());
app.use(express.json());
// app.use('/',(req,res)=>{
//     res.send("Hello world")
// })
app.use('/api/auth',require('./Server/Routes/userrouter'));
app.use('/api/note',require('./Server/Routes/notesrouter'));
connectDb();
app.listen('8080',()=>{
    console.log("listening at port 8080");
})