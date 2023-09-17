const jwt=require('jsonwebtoken');
const mysecret="Gotohell@2021";
const fetchuser=(req,res,next)=>{
    // Get the user from the JWT token and id to req object
    const token=req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error : "access denied"});
    }
    try{
        const data=jwt.verify(token,mysecret);
        req.user=data.user;
        next();
    }
    catch(error)
    {
        res.status(401).send({error : "access denied"});
    }
}



module.exports=fetchuser;