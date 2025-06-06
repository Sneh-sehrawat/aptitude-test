import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';

function ResultPage() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [calculatedScore, setCalculatedScore] = useState({
    English: 0,
    MathsReasoning: 0,
    Aptitude: 0,
    total: 0
  });

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem('questions')) || [];
    const a = JSON.parse(localStorage.getItem('answers')) || {};

    setQuestions(q);
    setAnswers(a);

    const scoreCalc = {
      English: 0,
      MathsReasoning: 0,
      Aptitude: 0,
      total: 0
    };

    q.forEach(q => {
      const userAnswer = a[q._id];
      if (userAnswer) {
        const isCorrect = userAnswer === q.correctAnswer;
        const score = isCorrect ? 2 : -1;
        scoreCalc[q.section] += score;
        scoreCalc.total += score;
      }
    });

    setCalculatedScore(scoreCalc);
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

  if (!questions.length) return <div>Loading result...</div>;

  const remark = calculatedScore.total >= 80
    ? "Excellent work!"
    : calculatedScore.total >= 60
    ? "Good job! Keep improving."
    : calculatedScore.total >= 50
    ? "You passed. Keep practicing."
    : "Fail - You need more practice.";

  return (
    <div className="result-container">
      <h2>Your Score Summary</h2>
      <p className="pass-fail">{calculatedScore.total >= 50 ? '🎉 Congratulations, You Passed!' : '❌ You Failed'}</p>

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

      <button className="review-button" style={{ marginTop: '15px', backgroundColor: '#28a745' }} onClick={handleStartNewTest}>
        Start New Test
      </button>
    </div>
  );
}

export default ResultPage;
