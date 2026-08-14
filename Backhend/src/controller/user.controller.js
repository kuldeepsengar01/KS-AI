const { validationResult } = require('express-validator');
const {UserModel}=require('../models/user.modal');
const jwt = require('jsonwebtoken');
const {SendOtp} = require('../services/email.service');
const {UploadImage}=require('../services/upload.image');
const bcrypt = require('bcrypt');
const { generateAIResponse } = require("../services/ai.service");



async function RagisterUser(req, res) {
    try {
        const data = req.body;
        

        // Validation
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array()
            });
        }

        // Check email
        const checkEmail = await UserModel.findOne({
            email: data.email
        });

        if (checkEmail) {
            return res.status(409).json({
                message: "User Already Registered"
            });
        }

        // Hash password
        const hashpassword = await bcrypt.hash(data.password, 10);


        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

         // OTP expires in 5 minutes
        const otpExpires = new Date(
            Date.now() + 5 * 60 * 1000
        );

        //send otp

        await SendOtp(data.email,otp);

        console.log('OTP send Successfully');

        //upload Image

        const uploadimage = await UploadImage(req.file);
        // Create user
        const user = await UserModel.create({
            name: data.name,
            email: data.email,
            image:uploadimage.url,
            mobile: data.mobile,
            password: hashpassword,
            otp: otp,
            otpExpires: otpExpires,
            isVerified: false
        });

        return res.status(201).json({
            message: 'Ragistration Successfully OTP send In your Email',
            user: {
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Registration Failed",
            error: error.message
        });
    }
}

async function CheckOtp(req, res) {
    try {

        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < new Date()) {
            return res.status(401).json({
                message: "OTP expired. Please resend OTP"
            });
        }

        // OTP correct
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        // JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWTSECRET,
            {
                expiresIn: '7d'
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "OTP Verified Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "OTP Verification Failed",
            error: error.message
        });
    }
}


async function ResendOtp(req, res) {
    try {

        const { email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        // Generate new OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // New expiry
        const otpExpires = new Date(
            Date.now() + 5 * 60 * 1000
        );

        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();

        // Send new OTP
        await SendOtp(user.email, otp);

        return res.status(200).json({
            message: "New OTP sent successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Failed to resend OTP",
            error: error.message
        });
    }
}

async function LoginUser(req,res){

    try{

    const {email,password}=req.body;

    const user = await UserModel.findOne({
        email
    })
    
    if(!user){
        return res.status(401).json({
            message:"Please Register First"
        })
    }

    const ismatch = await bcrypt.compare(password,user.password);

    if(!ismatch){
        return res.status(401).json({
            message:"Invaild Password",
        })
    }
        //generate token

    const token = jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWTSECRET,{
        expiresIn:'7d'
    });

    // generate cookies

    res.cookie('token',token,{
        httpOnly:true,
        maxAge: 7 * 24 *  60 * 60 * 1000
    })

    res.status(200).json({
        message:'User Login Successfully',
        user:{
            name:user.name,
            email:user.email
        }
    })

}catch(error){
    res.status(500).json({
        message:"User Not Found ",
        error:error.message
    })
}

}


async function chat(req, res) {

    try {

        const { message } = req.body;

        console.log("User message:", message);

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const reply = await generateAIResponse(message);

        console.log("AI reply:", reply);

        return res.status(200).json({
            reply: reply
        });

    } catch (error) {

        console.error("Chat Controller Error:", error);

        return res.status(500).json({
            message: "AI response failed",
            error: error.message
        });
    }
}

async function GetProfile(req, res) {
    try {

        // auth middleware ke baad user id available honi chahiye
        const userId = req.user._id || req.user.id;

        const user = await UserModel.findById(userId).select(
            '-password -otp'
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                image: user.image
            }
        });

    } catch (error) {

        console.error("Get Profile Error:", error);

        return res.status(500).json({
            message: "Unable to fetch profile",
            error: error.message
        });
    }
}



module.exports = {
    RagisterUser,
    CheckOtp,
    GetProfile,
    ResendOtp,
    LoginUser,
    chat
};