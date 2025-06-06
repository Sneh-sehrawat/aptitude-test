import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5050/api/auth/login', {
        email,
        password,
        role,
      });

      console.log("Login response:", data);

      if (data.success) {
        // ✅ Save token
        localStorage.setItem('token', data.token);
        console.log("Token saved:", data.token);

        if (data.role === 'admin') {
          console.log("Admin login successful");
          navigate('/admin');
        } else {
          console.log("User login successful");

          // Save user info
          localStorage.setItem('userInfo', JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company
          }));

          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/form');
        }
      } else {
        alert(data.message || 'Login failed');
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
      console.error("Login error:", error.response?.data || error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Select Role:
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
