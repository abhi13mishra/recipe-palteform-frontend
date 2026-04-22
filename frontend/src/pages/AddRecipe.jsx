import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const AddRecipe = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        ingredients: "",
        image: ""
    });


    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // prevent multiple clicks
        setLoading(true);

        try {
            const payload = {
                ...form,
                ingredients: form.ingredients.split(",").map(i => i.trim())
            };

            await API.post("/recipes", payload);

            toast.success("Recipe added");

            // reset form
            setForm({
                title: "",
                description: "",
                ingredients: "",
                image: ""
            });

            // redirect
            navigate("/");

        } catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data?.message || "Error adding recipe");
        }

        setLoading(false);
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4">Add Recipe</h2>

            <form onSubmit={handleSubmit} className="add-form">

                <input
                    type="text"
                    className="form-control mb-3"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />

                <textarea
                    className="form-control mb-3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />

                <input
                    type="text"
                    className="form-control mb-3"
                    name="ingredients"
                    value={form.ingredients}
                    onChange={handleChange}
                    placeholder="onion, tomato, rice"
                    required
                />

                <input
                    type="text"
                    className="form-control mb-3"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                />

                <button
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Recipe"}
                </button>

            </form>
        </div>
    );
};

export default AddRecipe;