import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function ResultPage() {
  const navigate = useNavigate();

  const [calculatedScore, setCalculatedScore] = useState({
    English: 0,
    MathsReasoning: 0,
    Aptitude: 0,
    total: 0
  });

  useEffect(() => {
    const savedScore = JSON.parse(sessionStorage.getItem("score"));
    if (savedScore) {
      setCalculatedScore(savedScore);
    }
  }, []);

  // 🚫 Disable browser back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "⚠️ You cannot leave or refresh during the test!";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () =>
      window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // ⏱️ Auto redirect after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.clear();
      navigate("/", { replace: true });
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  

  return (
    <div className="result-container">
      <img
        src={certiEdgeLogo}
        alt="CertiEdge Logo"
        className='logo-img'
      />

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
        <p><strong>Computer Fundamentals:</strong> {calculatedScore.computerFundamentals}</p>
        <p><strong>Total Score (out of 100):</strong> {calculatedScore.total}</p>
      </div>

      
    </div>
  );
}

export default ResultPage;


