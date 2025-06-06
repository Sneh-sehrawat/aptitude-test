import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !company) {
      alert('Please fill all fields');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5050/api/auth/signup', {
        name,
        email,
        password,
        company,
      });

      alert(data.message || 'Signup successful');
      navigate('/login'); // Signup ke baad login page pe bhej do
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default SignupPage;