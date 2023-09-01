const session = require('express-session');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const express = require("express")
const User = require("../Models/Users");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const verifyOtp = async (req,res)=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/AWT");
        const userId = req.params.userId;
        console.log('Received userId:', userId);

        // Ensure userId is in the correct format (ObjectId or string)
        const user = await User.findOne({ _id: userId });

        if (!user) {
            console.log('User not found.');
            req.flash('message', 'User not found.');
            return res.redirect('/');
        }

        // Generate JWT token
        const secretKey = 'awt'; 
        const payload = { userId: user._id.toString() }; // Convert ObjectId to string
        const jwttoken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log(req.body.otp)
        const tokenValidates = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: req.body.otp,
            window: 300
        });
        console.log("hey token are validate or not " +tokenValidates)
        if (tokenValidates) {
            req.flash('message', 'OTP verified successfully.');
                   // Close the database connection
    await mongoose.connection.close();
            return res.status(200).json({
                message: 'OTP verified successfully.',
                token: jwttoken
            });
        } else {
                   // Close the database connection
    await mongoose.connection.close();
            req.flash('message', 'Invalid OTP.');
            return res.redirect(`/otp/${userId}`);
        }
   
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(200).json({message:error})
        // res.redirect(`/otp/${req.params.userId}`);
    }
}
module.exports = {
   verifyOtp
  };
  