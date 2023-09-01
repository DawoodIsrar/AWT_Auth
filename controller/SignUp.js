
const mongoose = require("mongoose");
const Users = require("../Models/Users")
const bcrypt = require("bcrypt")
const session = require('express-session');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const SignUp=  async (req, res) => {

    await mongoose.connect("mongodb://127.0.0.1:27017/AWT");
    const { username, password } = req.body;
  
  
    try {
        
    // Check if the user already exists
    if (Users[username]) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const secret = speakeasy.generateSecret({ length: 20 });

      const user = new Users({
          username:req.body.username,
          email: req.body.email,
          password: hashedPassword,
          secret: secret.base32
      });
      await user.save();
      // Close the database connection
    await mongoose.connection.close();
    return res.status(201).json({message:'messageAccount created successfully. Please log in.'})
    // res.redirect('/');
    } catch (error) {
      console.error('Signup error:', error);
       return res.status(200).json({message:error})
        // res.redirect('/');
    }
  };
  module.exports = {
    SignUp
  }