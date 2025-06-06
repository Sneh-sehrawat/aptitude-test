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
                {/* Time Taken column removed here */}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-submissions">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                results.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.company}</td>
                    <td>{user.totalScore}/100</td>
                    <td>
                      <span
                        className={`result-badge ${
                          user.totalScore >= 50 ? "result-pass" : "result-fail"
                        }`}
                      >
                        {user.totalScore >= 50 ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td>{new Date(user.submittedAt).toLocaleDateString()}</td>
                    {/* Time Taken column removed here */}
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
