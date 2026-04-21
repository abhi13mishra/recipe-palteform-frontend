import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ================= TOKEN HELPERS =================
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH,
    { expiresIn: "7d" }
  );
};


// ================= COOKIE OPTIONS =================
const cookieOptions = {
  httpOnly: true,
  secure: true,       // production me true
  sameSite: "none"
};


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password too short"
      });
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash
    });

    res.status(201).json({
      success: true,
      message: "User registered"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Register failed"
    });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // set cookies
    res.cookie("token", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


// ================= PROFILE =================
export const profile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.userData // middleware se aa raha
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= REFRESH TOKEN =================
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("token", newAccessToken, cookieOptions);

    res.json({
      success: true
    });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
};


// ================= LOGOUT =================
export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logged out"
  });
};