import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
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

        console.log(form); //  DEBUG

        try {
            const res = await API.post("/auth/register", form);

            toast.success("Registered successfully.");
            navigate("/login");

        } catch (err) {
            console.log(err.response?.data); //  IMPORTANT
            toast.error(err.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Register</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    type="text"
                    name="username"   // 🔥 MUST BE username
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button className="btn btn-warning w-100">
                    Register
                </button>

            </form>
        </div>
    );
};

export default Register;