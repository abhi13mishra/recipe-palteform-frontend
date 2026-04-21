import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000
    },

    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one ingredient required"
      }
    },

    image: {
      type: String,
      default: ""
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);


//  INDEXES (VERY IMPORTANT)

// Fast queries
recipeSchema.index({ user: 1 });
recipeSchema.index({ createdAt: -1 });

//  Search index
recipeSchema.index({
  title: "text",
  description: "text",
  ingredients: "text"
});


export default mongoose.model("Recipe", recipeSchema);