import express from "express";
import {
  register,
  login,
  profile,
  refreshToken,
  logout
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();


// ================= AUTH =================

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.post("/refresh", refreshToken);
router.post("/logout", logout);


export default router;