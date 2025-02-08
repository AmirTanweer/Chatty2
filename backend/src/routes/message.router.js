const express=require('express')
const authentication=require('../middleware/authentication')
const {getUsersForSidebar,getMessages,sendMessage}=require('../controllers/message.controller')
const router=express.Router();

router.get("/user",authentication,getUsersForSidebar)

router.get("/:id",authentication,getMessages)

router.post("/send/:id",authentication,sendMessage)
module.exports=router
