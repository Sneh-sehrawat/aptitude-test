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

      if (data.success) {
        if (data.role === 'admin') {
          // Admin doesn't need token or user info
          navigate('/admin');
        } else {
          // ✅ Save token and user info for normal user
          localStorage.setItem('token', data.token);
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
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
      console.error(error);
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