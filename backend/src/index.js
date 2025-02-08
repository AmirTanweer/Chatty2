const express= require('express')
const cors=require('cors')
const app=express();
const cookieParser=require('cookie-parser')
const connectDB=require('./db')
const authRoutes=require('./routes/auth.router')
const messageRoutes=require('./routes/message.router') 
const port=5000 

app.use(express.json())
app.use(cors())
app.use(cookieParser());
connectDB()
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)

app.listen(port ,()=>{
    console.log("Server is running on port",port)
})