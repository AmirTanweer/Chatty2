const mongoose=require('mongoose')
const User=require('../models/User')
const {body ,validationResult}=require('express-validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
dotenv.config()
//Route 1 - Create a user using signup POST "/api/auth/signup" No login required
const signup = async (req, res) => {
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
            const {username,email,password}=req.body
         let user= await User.findOne({email})
         if (user) {
            return res.status(400).json({ error: "User already exists" }); // ❌ Duplicate email
         }
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt)
         user=new User({
            username:username,
            email:email,
            password:hashedPassword
         })
         await user.save()

            res.status(200).json({message:"User Created Successfully"})
   }   
   catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};



const login= async (req,res)=>{
   const errors = validationResult(req).array();
   if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).json({ errors });
   }
   try{
      const {email,password}=req.body
         let user= await User.findOne({email});
         if(!user){
            return res.status(404).json({errors:"No user found"})
         }
         const hashedPassword=user.password
         const verify= await bcrypt.compare(password,hashedPassword)
         if(!verify){
            return res.status(403).json({errors:"Access Denied"})
         }
         const data = {
            user: user._id 
         };
         
         const token=jwt.sign(data,process.env.SECRET)
         res.status(200).json({user:user,token:token})
       
   }
   catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

const logout=()=>{
    
}
module.exports={login,signup,logout}