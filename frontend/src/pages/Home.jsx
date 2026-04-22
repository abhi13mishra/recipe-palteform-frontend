import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get("q") || "";
    const [user, setUser] = useState(null);

    useEffect(() => {
        API.get("/auth/profile")
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null));
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);

            let url = "/recipes/public";
            if (query) url = `/search?q=${query}`;

            const res = await API.get(url);

            const data =
                Array.isArray(res.data) ? res.data :
                    Array.isArray(res.data.data) ? res.data.data :
                        Array.isArray(res.data.recipes) ? res.data.recipes :
                            [];

            setRecipes(data);
        } catch (err) {
            console.log(err);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [query]);

    // ❤️ LIKE / UNLIKE
    const handleLike = async (id) => {
        try {
            await API.post(`/recipes/${id}/favorite`);

            setRecipes(prev =>
                prev.map(r =>
                    r._id === id
                        ? {
                            ...r,
                            favorites: r.favorites.includes(user._id)
                                ? r.favorites.filter(f => f !== user._id)
                                : [...r.favorites, user._id]
                        }
                        : r
                )
            );

        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return <h4 className="text-center mt-4">Loading...</h4>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                {query ? `Search Results for "${query}"` : "Latest Recipes"}
            </h2>

            <div className="row">
                {recipes.length === 0 ? (
                    <p>No recipes found</p>
                ) : (
                    recipes.map((recipe) => (
                        <div key={recipe._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">

                            {/* 🔥 FULL CARD CLICKABLE */}
                            <div
                                className="card h-100 shadow-sm"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/recipe/${recipe._id}`)}
                            >

                                <img
                                    src={recipe.image}
                                    className="card-img-top"
                                    alt={recipe.title}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />

                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{recipe.title}</h5>

                                    <p className="card-text">
                                        {recipe.description?.slice(0, 80)}...
                                    </p>

                                    <p className="text-muted mb-2 card-text">
                                        👤 {recipe.user?.username || "unknown"}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">

                                        {/* ❤️ CLICKABLE HEART */}
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            style={{
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                color: recipe.favorites?.some(fav =>
                                                    (typeof fav === "string" ? fav : fav._id) === user?._id
                                                )
                                                    ? "red"
                                                    : "black"
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleLike(recipe._id);
                                            }}
                                        >
                                            ❤️ {recipe.favorites?.length || 0}
                                        </button>

                                        {/* VIEW BUTTON */}
                                        <Link
                                            to={`/recipe/${recipe._id}`}
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={(e) => e.stopPropagation()} // 🔥 important
                                        >
                                            View
                                        </Link>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default Home;