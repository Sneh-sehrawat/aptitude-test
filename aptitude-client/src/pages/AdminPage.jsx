// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/admin/results");
        setResults(res.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div className="no-submissions">Loading submissions...</div>;

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">📋 Test Submissions</h1>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Score</th>
                <th>Result</th>
                <th>Submission Date</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-submissions">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                results.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.company}</td>
                    <td>{user.score}</td>
                    <td>
                      <span
                        className={`result-badge ${
                          user.score >= 50 ? "result-pass" : "result-fail"
                        }`}
                      >
                        {user.score >= 50 ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{user.timeTaken || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
