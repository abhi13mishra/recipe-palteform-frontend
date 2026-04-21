import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import { sanitizeBody } from "./middleware/sanitize.js";

dotenv.config();
connectDB();

const app = express();

// ================= GLOBAL MIDDLEWARE =================

app.use(sanitizeBody);

// Security headers
app.use(helmet());

// Cookies
app.use(cookieParser());

// Body parser
app.use(express.json());

// CORS (frontend connect)
const allowedOrigins = [
  "http://localhost:5173", // ✅ local
  "https://recipe-sharing-p.netlify.app" // ✅ deployed
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Rate limit (global)
// app.use("/api/auth", rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 20
// }));

// Mongo sanitize (body)
app.use((req, res, next) => {
  req.query.q = mongoSanitize(req.query.q);
  next();
});


// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/search", searchRoutes);


// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("API Running");
});


// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message
  });
});


// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});