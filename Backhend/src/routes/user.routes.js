const express = require('express');
const router=express.Router();
const {body, validationResult}=require('express-validator');
const multer = require('multer');
const midleware=require('../middleware/user.middleware');
const controller=require('../controller/user.controller');


const upload = multer({
    storage:multer.memoryStorage()
})


router.post('/register',
    upload.single('image'),
    body('name').notEmpty(),
    body('email').isEmail(),
    body('mobile').notEmpty(),
    body('password').isLength({max:20}),
    controller.RagisterUser
)

router.post('/verify-otp',controller.CheckOtp);

router.post('/resend-otp',controller.ResendOtp);

router.get('/profile', midleware.authuser, controller.GetProfile);

router.post('/login',midleware.authuser,controller.LoginUser);

router.post('/chat',controller.chat)



module.exports=router;