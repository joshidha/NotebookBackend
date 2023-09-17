const mongoose=require('mongoose');
const uri=process.env.KEY;

const connectDb=async()=>{
    try{
        const connection=await mongoose.connect(uri,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`Database connected ${connection.connection.host}`);
    }
    catch(err){
        console.log(err);
    }
}
module.exports=connectDb;