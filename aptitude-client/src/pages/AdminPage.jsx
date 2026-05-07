import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/admin/results");
        console.log("🔍 Submissions received:", res.data);
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

  // ✅ CSV Download Functions
  const downloadStudentCSV = (user) => {
    const { name, sectionScores = {}} = user;

    let csvContent = `Section,Score,Total,Status\n`;

    for (const section in sectionScores) {
      if (section !== "totalScore") {
        const score = sectionScores[section];
        const total = section === "English" ? 20 : 40;
        const status = score >= total * 0.5 ? "Pass" : "Fail";
        // 🔥 Rename MathsReasoning → Computer Fundamentals
        const sectionName = section === "MathsReasoning" ? "Computer Fundamentals" : section;
        csvContent += `${sectionName},${score},${total},${status}\n`;
      }
    }

    csvContent += `Total,${sectionScores.totalScore || 0},100,${
      sectionScores.totalScore >= 50 ? "Pass" : "Fail"
    }\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name || "student"}_result.csv`;
    link.click();
  };

  const downloadAllCSV = () => {
    let csvContent = `Name,Email,English,Computer Fundamentals,Aptitude,Total,Result\n`;

    results.forEach((user) => {
      const { name, email, sectionScores = {} } = user;
      const total = sectionScores.totalScore || 0;
      const result = total >= 50 ? "Pass" : "Fail";

      csvContent += `${name || "—"},${email || "—"},${
        sectionScores.English || 0
      },${sectionScores.MathsReasoning || 0},${sectionScores.Aptitude || 0},${total},${result}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `all_students_results.csv`;
    link.click();
  };

  const downloadDateCSV = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5050/api/admin/results/date/${selectedDate}`);
      const dateResults = res.data;

      let csvContent = `Name,Email,Total,Result\n`;

      dateResults.forEach((user) => {
        const { name, email, sectionScores = {} } = user;
        const total = sectionScores.totalScore || 0;
        const result = total >= 20 ? "Pass" : "Fail";

        csvContent += `${name || "—"},${email || "—"},${total},${result}\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `students_results_${selectedDate}.csv`;
      link.click();
    } catch (error) {
      console.error('Error downloading date CSV:', error);
      alert('Failed to download CSV for selected date');
    }
  };

  if (loading)
    return <div className="no-submissions">Loading submissions...</div>;

  return (
    <div className="admin-container">
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className="logo-img" />
      <div className="admin-card">
        <div className="button1">
          <button
            onClick={() => navigate("/editquestions")}
            className="main-button1"
          >
            Edit Questions
          </button>
          <button onClick={downloadAllCSV} className="main-button1" style={{ marginLeft: '10px' }}>
            Download All CSV
          </button>
          <div style={{ marginLeft: '20px', display: 'inline-flex', alignItems: 'center' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <button onClick={downloadDateCSV} className="main-button1">
              Download CSV by Date
            </button>
          </div>
        </div>
        <h1 className="admin-title">📋 Test Submissions</h1>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Phone No</th>
                <th>College</th>
                <th>Stream</th>
                <th>10th Marks</th>
                <th>12th Marks</th>
                <th>CGPA</th>
                <th>Enrollment</th>
                <th>Type</th>
                <th>Score</th>
                <th>Result</th>
                <th>Submission Date</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-submissions">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                results.map((user, index) => {
                  const {
                    name = "—",
                    email = "—",
                    company = "—",
                    phoneno = "—",
                    type = "—",
                    stream = "—",
                    college = "—",
                    enrollment = "—",
                    highmarks = "—",
                    intermarks = "—",
                    cgpa = "—",
                    sectionScores = {},
                    submittedAt,
                  } = user;

                  const score = sectionScores.totalScore;
                  const scoreDisplay =
                    typeof score === "number" ? `${score}/100` : "—/100";
                  const dateDisplay = submittedAt
                    ? new Date(submittedAt).toLocaleDateString()
                    : "Invalid Date";
                  const resultColor = score >= 50 ? "result-pass" : "result-fail";

                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{company}</td>
                        <td>{phoneno}</td>
                        <td>{college}</td>
                        <td>{stream}</td>
                        <td>{highmarks}</td>
                        <td>{intermarks}</td>
                        <td>{cgpa}</td>
                        <td>{enrollment}</td>
                        <td>{type}</td>
                        <td>
                          <div className="score-cell">
                            <span className="score-badge">{scoreDisplay}</span>
                            <button
                              className="dropdown-button"
                              onClick={() => toggleExpand(index)}
                            >
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
                        <td>
                          <button
                            className="download-btn"
                            onClick={() => downloadStudentCSV(user)}
                          >
                            Download CSV
                          </button>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr className="breakdown-row">
                          <td colSpan="12">
                            <div className="section-breakdown">
                              <strong>Section-wise Scores:</strong>
                              <ul>
                                <li
                                  className={getColorClass(
                                    sectionScores.English || 0,
                                    20
                                  )}
                                >
                                  English: {sectionScores.English || 0}
                                </li>
                                <li
                                  className={getColorClass(
                                    sectionScores.MathsReasoning || 0,
                                    40
                                  )}
                                >
                                  Maths & Reasoning:{" "}
                                  {sectionScores.MathsReasoning || 0}
                                </li>
                                <li
                                  className={getColorClass(
                                    sectionScores.Aptitude || 0,
                                    40
                                  )}
                                >
                                  Aptitude: {sectionScores.Aptitude || 0}
                                </li>
                                <li
                                  className={getColorClass(
                                    sectionScores.computerFundamentals || 0,
                                    40
                                  )}
                                >
                                  Computer Fundamentals: {sectionScores.computerFundamentals || 0}
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
