import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/SignupPage.css"
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";


function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const API_BASE =  "https://aptitude-test-r4l2.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password ||!phoneno) {
      alert('Please fill all fields');
      return;
    }
     const nameRegex = /^[a-zA-Z\s]{1,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,50}$/;
    const phoneRegex = /^\d{10}$/;
   
    if (!name || !email || !password || !phoneno) {
      alert('Please fill all required fields');
      return;
    }
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
        company,
        phoneno,
      });

      alert(data.message || 'Signup successful');
      navigate('/login'); // Signup ke baad login page pe bhej do
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error(error);
    }
  };

  return (
    <div className='container1'>
   <img
  src={certiEdgeLogo}
  alt="CertiEdge Logo"
  className='logo-img'
/>

    <div style={{ maxWidth: 400}} className='signup-container'>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className='signup-form'>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phonenumber"
          value={phoneno}
          onChange={e => setPhoneno(e.target.value)}
          required
        />
        
        <input
          type="text"
          placeholder="Company(optional)"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
         <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#16a34a", fontWeight: "bold" }}>
            Sign In
          </a>
        </p>
        
        <button type="submit">Signup</button>
      </form>
    </div></div>
  );
}

export default SignupPage;