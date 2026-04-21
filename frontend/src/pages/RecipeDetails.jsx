import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    const fetchRecipe = async () => {
        try {
            const res = await API.get(`/recipes/${id}`);
            setRecipe(res.data.recipe);
        } catch (err) {
            console.log("Error fetching recipe");
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    if (!recipe) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4" style={{ maxWidth: "700px" }}>
            <h2>{recipe.title}</h2>

            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="img-fluid mb-3"
                />
            )}

            <p><strong>By:</strong> {recipe.user?.username}</p>

            <p>{recipe.description}</p>

            <h5>Ingredients:</h5>
            <ul>
                {recipe.ingredients.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetails;