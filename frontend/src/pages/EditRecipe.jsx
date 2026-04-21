import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        ingredients: "",
        image: ""
    });

    const fetchRecipe = async () => {
        try {
            const res = await API.get(`/recipes/${id}`);

            setForm({
                title: res.data.recipe.title,
                description: res.data.recipe.description,
                ingredients: res.data.recipe.ingredients.join(", "),
                image: res.data.recipe.image
            });

        } catch {
            toast.error("Failed to load recipe");
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.put(`/recipes/${id}`, {
                ...form,
                ingredients: form.ingredients.split(",").map(i => i.trim())
            });

            toast.success("Recipe updated");
            navigate("/my");

        } catch {
            toast.error("Update failed");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2>Edit Recipe</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                />

                <textarea
                    className="form-control mb-3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                />

                <button className="btn btn-success w-100">
                    Update
                </button>

            </form>
        </div>
    );
};

export default EditRecipe;