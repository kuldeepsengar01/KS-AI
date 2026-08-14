const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            unique:true
        },

        image: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        otp: {
            type: String
        },

        otpExpires: {
            type: Date
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel
};