const express=require('express')
const router=express.Router();

const {login ,signup,logout}=require('../controllers/auth.controller')
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

module.exports=router

