const User=require('../models/User')
const Message=require('../models/Message');
const { cloudinary } = require('../middleware/cloudinary');
const getUsersForSidebar=async(req,res)=>{
   try{
    const loggedInUserId=req.user._id;
  const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select('-password')
  res.status(200).json(filteredUsers)
   }
   catch(error){
    console.error("Error in getUsersForSidebar: ",error.message);
    res.status(500).json({error:"Internal server error"});
   }
}
const getMessages=async(req,res)=>{
try{
   const {id:userToChatId}=req.params
   const myId=req.user._id
   const messages=await Message.find({$or:[
    {senderId:myId,receiverId:userToChatId},
    {senderId:userToChatId,receiverId:myId}
   ]})
   
   res.status(200).json(messages)
}
catch(error){
    console.error("Error in getMessages: ",error.message);
    res.status(500).json({error:"Internal server error"});
   }

}
const sendMessage=async(req,res)=>{
    try{
        const {id:receiverId}=req.params
        const myId=req.user._id
        const {text,image}=req.body
       let imageUrl;
       if(image){
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url
       }

        

           const  newMessage =  new Message({
                senderId:myId,
                receiverId:receiverId,
                text:text ,
                image:imageUrl
            })
       await newMessage.save();
       //todo : realtime functionality goes here => socket.io

        res.status(200).json({newMessage:{text:text,image:image}})
    }
    catch(error){
        console.error("Error in Send Message controller: ",error.message);
        res.status(500).json({error:"Internal server error"});
       }
}


module.exports={getUsersForSidebar,getMessages,sendMessage};