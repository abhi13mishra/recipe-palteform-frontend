import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    const fetchMyRecipes = async () => {
        try {
            const res = await API.get("/recipes/my");
            setRecipes(res.data.recipes);
        } catch (err) {
            console.log(err.response?.data); //  DEBUG
            toast.error(err.response?.data?.message || "Error fetching my recipes");
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/recipes/${id}`);
            setRecipes(recipes.filter(r => r._id !== id));
        } catch (err) {
            toast.error("Delete failed.");
        }
    };

    useEffect(() => {
        fetchMyRecipes();
    }, []);


    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Recipes</h2>

            <div className="row">
                {recipes.length === 0 ? (
                    <p>No recipes yet</p>
                ) : (
                    recipes.map((recipe) => (
                        <div className="col-md-4 mb-4" key={recipe._id}>
                            <div className="card h-100 shadow-sm">

                                {recipe.image && (
                                    <img
                                        src={recipe.image}
                                        className="card-img-top"
                                        alt={recipe.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                )}

                                <div className="card-body">
                                    <h5 className="card-title">{recipe.title}</h5>

                                    <p className="card-text">
                                        {recipe.description.slice(0, 80)}...
                                    </p>

                                    {/* EDIT */}
                                    <button
                                        className="btn btn-primary w-100 mt-2"
                                        onClick={() => navigate(`/edit/${recipe._id}`)}
                                    >
                                        Edit
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        className="btn btn-danger w-100 mt-2"
                                        onClick={() => handleDelete(recipe._id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyRecipes;