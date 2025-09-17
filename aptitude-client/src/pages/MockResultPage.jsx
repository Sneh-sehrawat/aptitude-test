import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function MockResultPage() {
  const navigate = useNavigate();

  const [calculatedScore, setCalculatedScore] = useState({
    English: 0,
    MathsReasoning: 0,
    Aptitude: 0,
    total: 0
  });

  useEffect(() => {
    const savedScore = JSON.parse(localStorage.getItem("score"));
    if (savedScore) {
      setCalculatedScore(savedScore);
    }
  }, []);

  const handleReviewAnswers = () => {
    localStorage.setItem('mock_reviewMode', 'true');
    localStorage.setItem('mock_jumpTo', '0');
    navigate('/mock');   // ✅ go to mock test review
  };

  const handleStartNewTest = () => {
    localStorage.clear();
    navigate('/');
  };

  const remark = calculatedScore.total >= 80
    ? "Excellent work!"
    : calculatedScore.total >= 60
    ? "Good job! Keep improving."
    : calculatedScore.total >= 50
    ? "You passed. Keep practicing."
    : "Fail - You need more practice.";

  return (
    <div className="result-container">
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className='logo-img' />
      
      <h2>Mock Test Score Summary</h2>
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

export default MockResultPage;
