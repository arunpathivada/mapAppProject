// Import necessary modules
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Route for user registration
router.post("/register", async (req, res) => {
    try {
        // Destructure values from the request body
        const { username, email, password } = req.body;

        // Check if username or email already exist
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user
        const user = await newUser.save();

        // Respond with user ID
        res.status(200).json({ _id: user._id });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route for user login
router.post("/login", async (req, res) => {
    try {
        // Destructure values from the request body
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // If user is not found, return an error
        if (!user) {
            return res.status(400).json({ message: "Wrong Username or Password" });
        }

        // Validate the password
        const validPassword = await bcrypt.compare(password, user.password);

        // If password is not valid, return an error
        if (!validPassword) {
            return res.status(400).json({ message: "Wrong Username or Password" });
        }

        // Respond with user information
        res.status(200).json({ _id: user._id, username: user.username });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
