import express from "express";
import {
  addRecipe,
  getPublicRecipes,
  getRecipeById,
  getMyRecipes,
  deleteRecipe,
  toggleFavorite,
  getFavorites,
  updateRecipe
} from "../controllers/recipeController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ================= PUBLIC =================
router.get("/public", getPublicRecipes);

// ================= PROTECTED (IMPORTANT ORDER) =================
router.get("/my", protect, getMyRecipes);
router.get("/favorites", protect, getFavorites);

// ================= DYNAMIC (ALWAYS LAST) =================
router.get("/:id", getRecipeById);

// ================= OTHER =================
router.post("/", protect, addRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/favorite", protect, toggleFavorite);

export default router;