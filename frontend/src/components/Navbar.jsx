import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { useLocation } from "react-router-dom";



const Navbar = () => {
    const location = useLocation();
    const hideAuthPages = location.pathname === "/login" || location.pathname === "/register";
    const [q, setQ] = useState("");
    const { user, setUser } = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const navRef = useRef();




    const handleLogout = async () => {
        await API.post("/auth/logout");
        setUser(null);
        navigate("/login");
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQ(value);
        if (location.pathname === "/") {
            navigate(`/?q=${value}`);
        }
    };
    const closeNavbar = () => {
        const nav = navRef.current;
        if (!nav) return;

        const bsCollapse =
            window.bootstrap?.Collapse.getInstance(nav) ||
            new window.bootstrap.Collapse(nav, { toggle: false });

        bsCollapse.hide();
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!q.trim()) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await API.get(`/search?q=${q}`);
                setSuggestions(res.data.data.slice(0, 5));
            } catch {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [q]);


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-4 sticky-top">
            <div className="container-fluid px-3 px-lg-4">

                <Link className="navbar-brand" to="/">
                    RecipeApp
                </Link>

                {/*Mobile Toggle */}
                <button
                    className={`navbar-toggler ${isOpen ? "open" : ""}`}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* 🔥 Collapse Start */}
                <div
                    ref={navRef} className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>

                    {/* 🔍 Search */}
                    <div className="mx-lg-auto w-100 position-relative my-2 my-lg-0" style={{ maxWidth: "500px" }}>
                        <form
                            className="d-flex"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!q.trim()) return;
                                if (location.pathname === "/") {
                                    navigate(`/?q=${q}`);
                                }
                                setSuggestions([]);
                                closeNavbar(); // ✅ added
                            }}
                        >
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search recipes..."
                                value={q}
                                onChange={handleChange}
                            />
                        </form>

                        {suggestions.length > 0 && (
                            <div className="list-group position-absolute w-100 shadow">
                                {suggestions.map((item) => (
                                    <div
                                        key={item._id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => {
                                            navigate(`/recipe/${item._id}`);
                                            setQ("");
                                            setSuggestions([]);
                                            closeNavbar(); // ✅ added
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔗 Right side */}
                    <div className="ms-lg-auto d-flex flex-column flex-lg-row align-items-center text-center gap-3 mt-2 mt-lg-0">
                        {!user || hideAuthPages ? (
                            <>
                                <Link className="btn btn-outline-light" to="/login" onClick={closeNavbar}>
                                    Login
                                </Link>
                                <Link className="btn btn-warning" to="/register" onClick={closeNavbar}>
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link text-white px-2 text-center" to="/add" onClick={closeNavbar}>
                                    Add Recipe
                                </Link>
                                <Link className="nav-link text-white px-2 text-center" to="/my" onClick={closeNavbar}>
                                    My Recipes
                                </Link>
                                <Link className="nav-link text-white px-2 text-center" to="/favorites" onClick={closeNavbar}>
                                    Favorites
                                </Link>

                                <button
                                    className="btn btn-danger px-3"
                                    onClick={() => {
                                        handleLogout();
                                        closeNavbar();
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;