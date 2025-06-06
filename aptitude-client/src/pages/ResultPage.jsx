import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';

function ResultPage() {
  const navigate = useNavigate();
  const [calculatedScore, setCalculatedScore] = useState({
    English: 0,
    MathsReasoning: 0,
    Aptitude: 0,
    total: 0
  });

  useEffect(() => {
    const savedScore = JSON.parse(localStorage.getItem('score')) || {
      English: 0,
      MathsReasoning: 0,
      Aptitude: 0,
      total: 0
    };
    setCalculatedScore(savedScore);

    const user = JSON.parse(localStorage.getItem("user")); // name, email, company expected
    const answers = JSON.parse(localStorage.getItem("answers"));
    const startTime = parseInt(localStorage.getItem("startTime"), 10);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // seconds
    const submissionDate = new Date().toISOString();

    if (user && answers) {
      fetch("http://localhost:5050/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          company: user.company,
          answers,
          sectionScores: {
            English: savedScore.English,
            MathsReasoning: savedScore.MathsReasoning,
            Aptitude: savedScore.Aptitude
          },
          totalScore: savedScore.total,
          result: savedScore.total >= 50 ? "Passed" : "Failed",
          submissionDate,
          timeTaken
        })
      })
        .then(res => res.json())
        .then(data => console.log("✅ Result saved:", data))
        .catch(err => console.error("❌ Error saving result:", err));
    }
  }, []);

  const handleReviewAnswers = () => {
    localStorage.setItem('reviewMode', 'true');
    localStorage.setItem('jumpTo', '0');
    navigate('/quiz');
  };

  const handleStartNewTest = () => {
    localStorage.clear();
    navigate('/');
  };

  const remark =
    calculatedScore.total >= 80
      ? "Excellent work!"
      : calculatedScore.total >= 60
      ? "Good job! Keep improving."
      : calculatedScore.total >= 50
      ? "You passed. Keep practicing."
      : "Fail - You need more practice.";

  return (
    <div className="result-container">
      <h2>Your Score Summary</h2>
      <p className="pass-fail">
        {calculatedScore.total >= 50
          ? '🎉 Congratulations, You Passed!'
          : '❌ You Failed'}
      </p>

      <div className="score-breakdown">
        <p><strong>English:</strong> {calculatedScore.English}</p>
        <p><strong>Maths Reasoning:</strong> {calculatedScore.MathsReasoning}</p>
        <p><strong>Aptitude:</strong> {calculatedScore.Aptitude}</p>
        <p><strong>Total Score (out of 100):</strong> {calculatedScore.total}</p>
        <p><strong>Remark:</strong> {remark}</p>
      </div>

      <button className="review-button" onClick={handleReviewAnswers}>
        Review Your Answers
      </button>

      <button
        className="review-button"
        style={{ marginTop: '15px', backgroundColor: '#28a745' }}
        onClick={handleStartNewTest}
      >
        Start New Test
      </button>
    </div>
  );
}

export default ResultPage;
