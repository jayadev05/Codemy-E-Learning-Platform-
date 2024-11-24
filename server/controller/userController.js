 const express = require("express");
const User = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpSchema = require('../model/otpStore');
const otpGenerator = require("otp-generator");
const crypto = require('crypto');
const { mailSender, otpEmailTemplate } = require('../utils/nodeMailer');
const genarateAccesTocken = require("../utils/genarateAccesTocken");
const genarateRefreshTocken = require("../utils/genarateRefreshTocken");



const sendOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // Delete any existing OTP
        await otpSchema.deleteOne({ email });
        
        // Save new OTP
        const otpDoc = await otpSchema.create({
            email,
            otp: otp.toString()
        });
        
        console.log("Generated OTP:", otp);
        console.log("Saved OTP document:", otpDoc);
        
        const { subject, htmlContent } = otpEmailTemplate(otp);
        const info = await mailSender(email, subject, htmlContent);
        
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (err) {
        console.error("Error in sendOtp:", err);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};

const securePassword = async (password) => bcrypt.hash(password, 10);

const signUp = async (req, res) => {
    try {
        console.log(req.body)
        const { name, password, email, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(409).json({ message: "User already exists" });

        const userId = await generateUniqueUserId();
        const passwordHash = await securePassword(password);
        const newUser = await User.create({
            name, password: passwordHash, email, phone, role: "student", user_id: userId
        });
        res.status(200).json({ message: "User is registered", userData: newUser });
    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        if (user.isActive === false) return res.status(403).json({ message: "Your account is blocked. Contact support." });

        if (await bcrypt.compare(password, user.password)) {
            genarateAccesTocken(res,user._id)
            genarateRefreshTocken(res,user._id)
            res.status(200).json({ message: "Login successful", userData: user });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const passwordResetTemplate = (resetURL) => {
    return {
        subject: "Password Reset Request",
        htmlContent: `
            <h1>Password Reset Request</h1>
            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetURL}">${resetURL}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `
    };
};

const generateUniqueUserId = async (prefix = 'skfnty') => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const userId = `${prefix}${randomNumber}`;
    const exists = await User.findOne({ user_id: userId });
    return exists ? generateUniqueUserId(prefix) : userId;
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetURL = `http://localhost:5173/reset-password/${resetToken}?role=${user.role}`;
        const { subject, htmlContent } = passwordResetTemplate(resetURL);
        await mailSender(email, subject, htmlContent);

        res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Password reset token is invalid or has expired" });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const updateUser = async (req, res) => {
    try {
        const { _id, email, name, phone, profileImage } = req.body;
        console.log('Received update request:', { _id, email, name, phone, profileImage });

        const user = await User.findById(_id);
        if (!user) {
            console.log('User not found:', _id);
            return res.status(404).json({ message: "User not found" });
        }

        const updatedData = { 
            ...(name && { name }), 
            ...(email && { email }), 
            ...(phone && { phone }),
            ...(profileImage && { profileImage })
        };
        console.log('Updating user with data:', updatedData);

        const updatedUser = await User.findByIdAndUpdate(_id, updatedData, { new: true });
        console.log('Updated user:', updatedUser);
        
        res.json({ message: "Update successful", updatedUser });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken')
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { signUp, login, updateUser, logoutUser, forgotPassword, resetPassword, sendOtp };
