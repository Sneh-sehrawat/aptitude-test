import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReviewPage.css';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function ReviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE || "https://aptitude-test-r4l2.onrender.com";

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem('questions')) || [];
    const a = JSON.parse(localStorage.getItem('answers')) || {};
    const f = JSON.parse(localStorage.getItem('flagged')) || [];

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
    const { company, phoneno, college, stream, enrollment, highmarks, intermarks, cgpa } = userInfo;
    const timeTaken = localStorage.getItem("timeTaken") || null;
    const token = localStorage.getItem("token");

    try {
      // Fetch full questions to calculate score
      const resQuestions = await fetch(`${API_BASE}/api/questions/full`, {
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

      // Submit final test
      const response = await fetch(`${API_BASE}/api/submit-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company,
          phoneno,
          college,
          stream,
          enrollment,
          highmarks,
          intermarks,
          cgpa,
          score: scoreData,
          timeTaken,
          type: "quiz",
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit test");

      console.log("✅ Test submitted successfully:", data);
      navigate('/result');
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert("Failed to submit test. Please check console for details.");
    }
  };

  const jumpToQuestion = (index) => {
    localStorage.setItem("jumpTo", index);
    localStorage.setItem("returnToReview", "true");
    navigate("/quiz");
  };

  if (!questions.length) return <div>Loading review page...</div>;

  return (
    <div>
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className='logo-img' />
      <div className="review-container">
        <h2>Review Your Responses</h2>
        <div className="review-grid">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`review-item ${getStatus(index, q._id).toLowerCase()}`}
              onClick={() => jumpToQuestion(index)}
              style={{ cursor: 'pointer' }}
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
          Submit Final Test
        </button>
      </div>
    </div>
  );
}

export default ReviewPage;
