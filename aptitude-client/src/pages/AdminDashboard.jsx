import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5050/api/admin/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  // Summary stats
  const totalUsers = users.length;
  const passedUsers = users.filter(u => u.passed).length;
  const failedUsers = totalUsers - passedUsers;

  // Date wise submission count (YYYY-MM-DD)
  const dateCounts = users.reduce((acc, user) => {
    const date = new Date(user.submitDate).toISOString().slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {loading && <p>Loading user data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: 20 }}>
            <h3>Summary</h3>
            <p>Total Users Appeared: <strong>{totalUsers}</strong></p>
            <p>Passed Users: <strong>{passedUsers}</strong></p>
            <p>Failed Users: <strong>{failedUsers}</strong></p>

            <h4>Date-wise Submissions:</h4>
            <ul>
              {Object.entries(dateCounts).map(([date, count]) => (
                <li key={date}>
                  {date}: {count} submission{count > 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          </div>

          <h3>User Test Details</h3>
          <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#eee' }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Submit Date</th>
                <th>Time Taken (minutes)</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.company}</td>
                  <td>{new Date(user.submitDate).toLocaleString()}</td>
                  <td>{user.timeTaken}</td>
                  <td style={{ color: user.passed ? 'green' : 'red' }}>
                    {user.passed ? 'Passed' : 'Failed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
