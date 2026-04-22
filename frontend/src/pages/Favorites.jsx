import { useEffect, useState } from "react";
import API from "../api/axios";

const Favorites = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const res = await API.get("/recipes/favorites");
            setRecipes(res.data.recipes);
        } catch {
            console.log("Error fetching favorites");
        }
    };

    const handleRemove = async (id) => {
        try {
            await API.post(`/recipes/${id}/favorite`);
            setRecipes(prev => prev.filter(r => r._id !== id));
        } catch {
            console.log("Error removing favorite");
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) {
        return <h4 className="text-center mt-4">Loading...</h4>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Favorite Recipes</h2>

            <div className="row">
                {recipes.length === 0 ? (
                    <p>No favorites yet</p>
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
                                    <h5>{recipe.title}</h5>
                                    <p>{recipe.description.slice(0, 80)}...</p>

                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={() => handleRemove(recipe._id)}
                                    >
                                        Remove
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

export default Favorites;