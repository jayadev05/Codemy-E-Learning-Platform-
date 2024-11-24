const express = require("express");
const User = require("../model/userModel");
const Category = require('../model/categoryModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const crypto = require('crypto');
const { mailSender } = require('../utils/nodeMailer');
const generateAccessToken = require('../utils/genarateAccesTocken');
const generateRefreshToken = require("../utils/genarateRefreshTocken");

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    if(user?.role === "admin"){
      const resetToken = crypto.randomBytes(20).toString('hex');

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; 

      await user.save();

      const resetURL = `http://localhost:5173/admin/reset-password/${resetToken}`;

      const { subject, htmlContent } = passwordResetTemplate(resetURL);
      await mailSender(email, subject, htmlContent);

      res.status(200).json({ message: 'Password reset link sent' });
    } else {
      res.status(403).json({ message: 'Not authorized for password reset' });
    }
  } catch (error) {
    console.error(error);
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

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminInfo = await User.findOne({ email });

    if (adminInfo?.role === "admin") {
      if (await bcrypt.compare(password, adminInfo.password)) {
        generateAccessToken(res, adminInfo._id);
        generateRefreshToken(res, adminInfo._id);

        return res.status(200).json({
          message: "Login successful",
          adminData: adminInfo,
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(401).json({ message: "No access" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const students = async(req, res) => {
  try {
    const students = await User.find({role: "student"});
    console.log(students);
    if(!students) {
      return res.status(404).json({message: "No students found"});
    }
    return res.status(200).json({message: "Students data fetched successfully", students});
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const tutors = async(req, res) => {
  try {
    const tutors = await User.find({role: "tutor"});
    console.log(tutors);
    if(!tutors) {
      return res.status(404).json({message: "No tutors found"});
    }
    return res.status(200).json({message: "Tutors data fetched successfully", tutors});
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutAdmin = async (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const listUser = async(req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findByIdAndUpdate({_id: id}, {isActive: true}, {new: true});
    if(!user) {
      res.status(404).json({success: false, message: "User not found"});
    } else {
      res.status(200).json({success: true, message: "User is listed"});
    }
  } catch(error) {
    console.log("Server error", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const unlistUser = async(req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate({_id: id}, {isActive: false}, {new: true});
    if(!user) {
      res.status(404).json({success: false, message: "User not found"});
    } else {
      res.status(200).json({success: true, message: "User is unlisted"});
    }
  } catch(error) {
    console.log("Server error", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const lisTtutor = async(req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await User.findByIdAndUpdate({_id: id}, {isActive: true}, {new: true});
    if(!user) {
      res.status(404).json({success: false, message: "Tutor not found"});
    } else {
      res.status(200).json({success: true, message: "Tutor is listed"});
    }
  } catch(error) {
    console.log("Server error", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const unlisTtutor = async(req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate({_id: id}, {isActive: false}, {new: true});
    if(!user) {
      res.status(404).json({success: false, message: "Tutor not found"});
    } else {
      res.status(200).json({success: true, message: "Tutor is unlisted"});
    }
  } catch(error) {
    console.log("Server error", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const addCategory = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const category = new Category({ title, description });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("This is the category request coming ", categories);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }                             
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: "Token refreshed successfully" });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Failed to refresh token" });
  }
};

module.exports = {
  adminLogin,
  forgotPassword,
  resetPassword,
  logoutAdmin,
  students,
  tutors,
  listUser,
  unlistUser,
  lisTtutor,
  unlisTtutor,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  refreshAdminToken
};