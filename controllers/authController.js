const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        const error = new Error("JWT_SECRET is not configured");
        error.statusCode = 500;
        throw error;
    }
    return process.env.JWT_SECRET;
};

const register = async (req, res, next) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        await User.create({ email, password });
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        const passwordMatches = user && await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id.toString() }, getJwtSecret(), { expiresIn: "1h" });
        res.status(200).json({ success: true, token });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("email createdAt");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            data: { id: user._id.toString(), email: user.email, createdAt: user.createdAt }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };