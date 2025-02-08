const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const User=require('../models/User')
const authentication= async (req,res,next)=>{
     try{
        
        const token=req.cookies.jwt_token
       
        if(!token){
            return res.status(401).json({message:"Unauthorized - No Token Provided"});
        }
        const decoded=jwt.verify(token,process.env.SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }
        const user=await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
       
        req.user=user
        next()
     }
     catch(error){
     console.log("Error in protectRoute middleware: ",error.message);
     res.status(500).json({Error:"Internal Server Error"})
     } 
}
module.exports=authentication