import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

export const searchRecipes = async (req, res) => {
  try {
    const { q = "" } = req.query;

    const search = q.toLowerCase().trim();

    // ✅ FIX HERE
    const recipes = await Recipe.find().populate("user", "username");

    if (!search) {
      return res.json({
        success: true,
        data: recipes
      });
    }

    // 🔥 USER SEARCH
    const users = await User.find({
      username: { $regex: `^${search}`, $options: "i" }
    });

    const userIds = users.map(u => u._id.toString());

    const filtered = recipes.filter(r => {
      const title = r.title?.toLowerCase() || "";
      const userId = r.user?._id?.toString();

      return (
        title.startsWith(search) ||
        userIds.includes(userId)
      );
    });

    res.json({
      success: true,
      data: filtered
    });

  } catch (err) {
    console.error("❌ SEARCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};