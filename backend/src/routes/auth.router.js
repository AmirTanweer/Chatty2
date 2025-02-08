const express=require('express')
const router=express.Router();
const authentication=require('../middleware/authentication')
const {login ,signup,logout,updateProfile,checkAuth}=require('../controllers/auth.controller')
const {body }=require('express-validator')
router.post('/login',login);
router.post('/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ], signup)
router.post('/logout',logout)

router.put("/update-profile",authentication,updateProfile)

router.get("/check",authentication,checkAuth)

module.exports=router

