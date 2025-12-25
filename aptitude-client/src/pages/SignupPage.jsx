import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/SignupPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = "https://aptitude-test-1-4le1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phoneno) {
      alert('Please fill all fields');
      return;
    }

    const nameRegex = /^[a-zA-Z\s]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,50}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(name)) {
      alert('Name should only contain letters and spaces, max 50 characters');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Enter a valid email address, max 50 characters');
      return;
    }
    if (!phoneRegex.test(phoneno)) {
      alert('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE}/api/auth/signup`, {
        name,
        email,
        password,
        phoneno,
      });

      alert(data.message || 'Signup successful');
      navigate('/login', { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error(error);
    }
  };

  useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (token) {
    navigate("/form", { replace: true });
  }
}, [navigate]);

  return (
    <div className='container1'>
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className='logo-img' />

      <div className='signup-container'>
        <h2>Signup</h2>

        <form onSubmit={handleSubmit} className='signup-form'>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phoneno}
            onChange={e => setPhoneno(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            required
          />

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#16a34a", fontWeight: "bold" }}>
              Sign In
            </a>
          </p>

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;

