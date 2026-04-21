import express from "express";
import { searchRecipes } from "../controllers/searchController.js";
//import { sanitizeQuery } from "../middleware/sanitize.js";

const router = express.Router();


//  Recipe search
router.get("/", searchRecipes);


export default router;