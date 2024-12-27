import { generateTokens } from "../lib/utils.js";
import User from "../models/user.model.js"; // using {} when export as normal not as default
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js'
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    //checking for empty fields
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //checking for pasword length as schema
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // checking if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    //encrypting the password using bcrypt
    const salt = await bcrypt.genSalt(10); //salt is a randomly generated string of characters that is added to a password before it is hashedw
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating the user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateTokens(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server ERROR!!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateTokens(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  console.log("backend mein hai");
  console.log("backend mein hai");
  console.log("backend mein hai");
  console.log("backend mein hai");
  try {
    const { profilePic } = req.body;
    console.log("Profile Pic: ", profilePic);  // Ensure this contains a valid base64 string

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const userId = req.user._id;

    // Attempt to upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    console.log("Cloudinary upload response: ", uploadResponse); // Check if upload was successful

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
};



export const checkAuth = async(req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller: ",error);
    res.status(500).json({message: 
      "Internal Server Error: ", error
    })
  }
};
