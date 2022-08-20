const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { emailValidation } = require("../utils/emailValidation");
const { generateToken } = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  
  const { username, email, password } = req.body;
  const isEmailValid = emailValidation(email);
  const isPasswordValid = password.length > 5;

  if (isEmailValid && isPasswordValid) {
    const isUsernameExists = await User.findOne({ username: username });
    if (isUsernameExists) {
      res.status(400);
      throw new Error("Username Not Available");
    } else {
      const isEmailExists = await User.findOne({ email: email });
      if (isEmailExists) {
        res.status(400);
        throw new Error("Email Already Exists");
      } else {
        const createUser = new User(req.body);
        const newUser = await createUser.save();
        return res.status(200).json({
          newUser,
        });
      }
    }
  } else {
    if (isEmailValid === false) {
      res.status(400);
      throw new Error("Please Enter Valid Email");
    }
    if (isPasswordValid === false) {
      res.status(400);
      throw new Error("Please Enter A Password more then 5 charactures");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const isPasswordValid = password.length > 5;
  if (isPasswordValid) {
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        userExists.password
      );
      if (isPasswordMatched) {
        return res.status(200).json({
          _id: userExists._id,
          username: userExists.username,
          email: userExists.email,
          token: generateToken(userExists._id),
        });
      } else {
        res.status(400);
        throw new Error("password does not matched!");
      }
    } else {
      res.status(400);
      throw new Error("User does not exists with this Username");
    }
  } else {
    res.status(400);
    throw new Error("Please Enter A Password more then 5 charactures");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("No User Found");
  } else {
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      emal: user.email,
    });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const isEmailValid = emailValidation(email);
  if (isEmailValid) {
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      const resetLink = `reset-link`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.mail_account,
          pass: process.env.mail_app_pass,
        },
      });

      let mailOptions = {
        from: "alphamhdy@gmail.com", // your email
        to: emailExists.email,
        subject: `The subject goes here `,
        html: `Please Click ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.status(400);
          throw new Error("something happend wrong");
        } else {
          return res.status(200).json({
            msg: "Please Check Your Email",
          });
        }
      });
    } else {
      res.status(404);
      throw new Error("Email does not Exist");
    }
  } else {
    res.status(400);
    throw new Error("Please Enter Valid Email");
  }
});

module.exports = { registerUser, loginUser, currentUser, forgetPassword };
