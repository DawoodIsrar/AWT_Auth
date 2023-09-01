const mongoose = require("mongoose");
const Users = require("../Models/Users");
const BlockedIPs = require("../Models/BlockedIp"); // Create a new model for blocked IPs
const bcrypt = require("bcrypt");
const session = require('express-session');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const secretKey = 'your-secret-key'; 

// Endpoint for user login
const Login = async (req, res) => {
  const { username, password } = req.body;
  await mongoose.connect("mongodb://127.0.0.1:27017/AWT");
  const clientIP = req.ip; // Get the client's IP address

  try {
    // Check if the IP is blocked
    const blockedIP = await BlockedIPs.findOne({ ipAddress: clientIP });

   
    // Check if the user exists
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Update failed attempt count and timestamp for the IP
      if (!blockedIP) {
        const newBlockedIP = new BlockedIPs({
          ipAddress: clientIP,
          failedAttempts: 1,
          blockedUntil: Date.now() + 2 * 60 * 1000, // Block for 2 minutes
        });
        await newBlockedIP.save();
      } else {
        blockedIP.failedAttempts++;
        blockedIP.blockedUntil = Date.now() + 2 * 60 * 1000; // Extend block for 2 more minutes
        await blockedIP.save();
        
        // If the IP exceeded the attempts, block it for 2 minutes
        if (blockedIP.failedAttempts > 5) {
          console.log(blockedIP.failedAttempts)
          if (blockedIP && Date.now() < blockedIP.blockedUntil ) {
            return res.status(403).json({ message: 'IP address blocked. Please try again later.' });
          }
          return res.status(403).json({ message: 'IP address blocked. Please try again later.' });
        }
         // If the IP is blocked and the block period has not passed, deny access
  

      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset failed attempts for the IP
    if (blockedIP) {
      await BlockedIPs.deleteOne({ _id: blockedIP._id });
    }


    if (!user) {
        req.flash('message', 'Email not found.');
        return res.redirect('/');
    }

    // Generate OTP token
    const secret = user.secret; 
    const token = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        window: 300
    });

    // Send OTP via email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'awtrawalpindi@gmail.com', 
            pass: 'aijgtkinvcikihod' 
        }
    });

    let mailOptions = {
        from: 'awtrawalpindi@gmail.com', 
        to: user.email,
        subject: 'Login OTP Verification',
        text: `Welcom to the AWT Admin Verification Your OTP is: ${token}`
    };

    await transporter.sendMail(mailOptions);

    // req.flash('message', 'OTP sent to your email. Please check your email for the OTP.');
    // res.redirect(`/otp/${user.id}`);
    await mongoose.connection.close();
    return res.status(200).json({message:'message: OTP sent to your email. Please check your email for the OTP.'});
  } catch (error) {
    console.error('Login error:', error);
   return res.status(200).json({message:error})
    // res.redirect('/');
  }
};



module.exports = {
  Login
};

