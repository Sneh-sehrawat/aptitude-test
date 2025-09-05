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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !company||!phoneno) {
      alert('Please fill all fields');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5050/api/auth/signup', {
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
    <div className='container'>
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
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
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
    </div></div>
  );
}

export default SignupPage;