import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = "https://aptitude-test-1-4le1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
        role,
      });

      if (data.success) {
        if (data.token) sessionStorage.setItem("token", data.token);
        if (data.user) sessionStorage.setItem("user", JSON.stringify(data.user));

        if (data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/form", { replace: true });
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (token) {
    navigate("/form", { replace: true });
  }
}, [navigate]);


  return (
    <div className="container">
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className="logo-img" />

      <div className="login-container">
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Select Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#16a34a", fontWeight: "bold" }}
            >
              Sign up
            </Link>
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;


