import Recipe from "../models/Recipe.js";

// ================= ADD RECIPE =================
export const addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, image } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      image,
      user: req.user
    });

    res.status(201).json({
      success: true,
      recipe
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add recipe"
    });
  }
};

// ================= GET ALL PUBLIC RECIPES =================
export const getPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= GET SINGLE RECIPE =================
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("user", "username");

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    res.json({
      success: true,
      recipe
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= MY RECIPES =================
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= UPDATE RECIPE =================
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    if (recipe.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    const { title, description, ingredients, image } = req.body;

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.image = image || recipe.image;

    await recipe.save();

    res.json({
      success: true,
      recipe
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= DELETE RECIPE =================
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    if (recipe.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    await recipe.deleteOne();

    res.json({
      success: true,
      message: "Recipe deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= FAVORITE TOGGLE =================
export const toggleFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    const userId = req.user;

    // ❌ OWNER RESTRICTION
    if (recipe.user.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot favorite your own recipe"
      });
    }

    const already = recipe.favorites.includes(userId);

    if (already) {
      recipe.favorites = recipe.favorites.filter(
        id => id.toString() !== userId.toString()
      );
    } else {
      recipe.favorites.push(userId);
    }

    await recipe.save();

    res.json({
      success: true,
      liked: !already,
      total: recipe.favorites.length
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// ================= GET FAVORITES =================
export const getFavorites = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      favorites: req.user
    }).populate("user", "username");

    res.json({
      success: true,
      recipes
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};