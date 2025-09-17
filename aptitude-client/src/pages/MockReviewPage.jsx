import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReviewPage.css';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png"

function MockReviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem('mock_questions')) || [];
    const a = JSON.parse(localStorage.getItem('mock_answers')) || {};
    const f = JSON.parse(localStorage.getItem('mock_flagged')) || [];

    if (!q.length) return navigate('/');

    setQuestions(q);
    setAnswers(a);
    setFlagged(f);
  }, [navigate]);

  const getStatus = (index, id) => {
    const isAnswered = Boolean(answers[id]);
    const isFlagged = flagged.includes(index);
    if (isFlagged && !isAnswered) return 'Flagged';
    if (isFlagged && isAnswered) return 'Answered-Flagged';
    if (isAnswered) return 'Answered';
    return 'Skipped';
  };

  const answeredCount = questions.filter(q => answers[q._id]).length;
  const flaggedOnlyCount = flagged.filter(i => !answers[questions[i]?._id]).length;
  const skippedCount = questions.length - answeredCount;

  const handleFinalSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const { company, phoneno, college } = userInfo;
    const timeTaken = localStorage.getItem("timeTaken") || null;
    const token = localStorage.getItem("token");

    try {
      const resQuestions = await fetch("http://localhost:5050/api/questions/mock/full", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const fullQuestions = await resQuestions.json();

      const scoreData = { English: 0, MathsReasoning: 0, Aptitude: 0, total: 0 };

      fullQuestions.forEach(q => {
        const userAnswer = answers[q._id];
        if (userAnswer) {
          const isCorrect = userAnswer === q.correctAnswer;
          const score = isCorrect ? 2 : -1;
          scoreData[q.section] += score;
          scoreData.total += score;
        }
      });

      localStorage.setItem("score", JSON.stringify(scoreData));

      await fetch("http://localhost:5050/api/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company,
          phoneno,
          college,
           type: "mock",
          score: scoreData,
          timeTaken,
         
        })
      });

      navigate('/mockresult');
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert("Failed to submit mock test.");
    }
  };

  return (
    <div>
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className='logo-img' />

      <div className="review-container">
        <h2>Review Your Mock Test Responses</h2>

        <div className="review-grid">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`review-item ${getStatus(index, q._id).toLowerCase()}`}
              onClick={() => {
                localStorage.setItem("jumpTo", index);
                navigate("/mocktest");
              }}
            >
              Q{index + 1}: {getStatus(index, q._id).replace('-', ' ')}
            </div>
          ))}
        </div>

        <div className="review-summary">
          <p>✅ Answered: {answeredCount}</p>
          <p>🚩 Flagged: {flaggedOnlyCount}</p>
          <p>⚠️ Skipped: {skippedCount}</p>
        </div>

        <button className="final-submit-btn" onClick={handleFinalSubmit}>
          Submit Final Mock Test
        </button>
      </div>
    </div>
  );
}

export default MockReviewPage;
