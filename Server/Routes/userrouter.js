const express=require('express');
const route=express.Router();
// create a user using :POST "/api/auth/" doesn't require Authentication
const User=require('../Model/User');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');   // package to hash passwords 
const jwt=require('jsonwebtoken');  // package to generate web tokens for web application
const mysecret="Gotohell@2021";
const fetchuser=require('../Middleware/fetchuser');
// Create User route
route.post('/adduser',[
    body('email','enter valid email').isEmail(),
    body('name','enter valid name').isLength({min:3}),
    body('password','enter valid password').isLength({min:5})
    ],async (req,res)=>{
        // if we got an error we will send bad request
    
        const errors = validationResult(req);
        let success=false;
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({ errors: errors.array() });
        }

    // console.log(req.body);
    // const user=User(req.body);
    // user.save();
    // res.send(req.body);
    try{
    let user=await User.findOne({email:req.body.email});
    if(user)
    {
        return res.status(500).json({error:"Please enter a unique email"});

    }
    const salt=await bcrypt.genSalt(10);
    const securePassword=await bcrypt.hash(req.body.password,salt);
    user= await User.create({
        name: req.body.name,
        password:securePassword,
        email:req.body.email
      })
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err);
    //     res.json({error:"Please enter a unique email"});
    // })
    const data={
        user:{
            id:user.id
        }
    }
    const authToken=jwt.sign(data,mysecret);
    success=true;
    res.json({success,authToken});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

// Login route .Authenticate a user using POST "api/auth/login"
route.post('/login',[
    body('email','enter valid email').isEmail(),
    body('password','password cannot be blank').exists()
    ],
    async (req,res)=>{
        let success=false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email,password}=req.body;
        try{
            let user=await User.findOne({email});
            if(!user)
            {
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const passwordCompare=await bcrypt.compare(password,user.password);
            if(!passwordCompare)
            {
                return res.status(400).json({error:"Please try to login with correct credentials"});
            }
            const data={
                user:{
                    id:user.id
                }
            }
            const authToken=jwt.sign(data,mysecret);
            success=true;
            res.json({success,authToken});
        }
        catch(err){
            console.log(err);
            res.status(500).send("Internal server error");
        }
    })

// Get logged in users details using '/api/auth/getuser'. Login required
route.post('/getuser',fetchuser,
async (req,res)=>{
try {
    const userid=req.user.id;
    const user=await User.findById(userid).select('-password');
    res.send(user);
} catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
}
})
module.exports=route;