import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/admin/results");
        console.log("🔍 Submissions received:", res.data); // Debug log
        setResults(res.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getColorClass = (score, total) => {
    const percent = (score / total) * 100;
    if (percent >= 70) return "score-green";
    if (percent >= 50) return "score-orange";
    return "score-red";
  };

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

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
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-submissions">No submissions found.</td>
                </tr>
              ) : (
                results.map((user, index) => {
                  console.log("🧪 User submission:", user); // Debug log

                  const {
                    name = "—",
                    email = "—",
                    company = "—",
                    sectionScores = {},
                    submittedAt,
                  } = user;

                  const score = sectionScores.totalScore;
                  const scoreDisplay = typeof score === "number" ? `${score}/100` : "—/100";
                  const dateDisplay = submittedAt ? new Date(submittedAt).toLocaleDateString() : "Invalid Date";
                  const resultColor = score >= 50 ? "result-pass" : "result-fail";

                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{company}</td>
                        <td>
                          <div className="score-cell">
                            <span className="score-badge">{scoreDisplay}</span>
                            <button className="dropdown-button" onClick={() => toggleExpand(index)}>
                              ▼
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`result-badge ${resultColor}`}>
                            {score >= 50 ? "Passed" : "Failed"}
                          </span>
                        </td>
                        <td>{dateDisplay}</td>
                      </tr>
                      {expandedRow === index && (
                        <tr className="breakdown-row">
                          <td colSpan="6">
                            <div className="section-breakdown">
                              <strong>Section-wise Scores:</strong>
                              <ul>
                                <li className={getColorClass(sectionScores.English || 0, 20)}>
                                  English: {sectionScores.English || 0}/20
                                </li>
                                <li className={getColorClass(sectionScores.MathsReasoning || 0, 40)}>
                                  Maths Reasoning: {sectionScores.MathsReasoning || 0}/40
                                </li>
                                <li className={getColorClass(sectionScores.Aptitude || 0, 40)}>
                                  Aptitude: {sectionScores.Aptitude || 0}/40
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
