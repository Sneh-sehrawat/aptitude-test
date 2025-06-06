import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ReviewPage.css";

function ReviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem("questions")) || [];
    const a = JSON.parse(localStorage.getItem("answers")) || {};
    const f = JSON.parse(localStorage.getItem("flagged")) || [];

    if (!q.length) {
      navigate("/");
      return;
    }

    setQuestions(q);
    setAnswers(a);
    setFlagged(f);
  }, [navigate]);

  const getStatus = (index, id) => {
    const isAnswered = answers[id] !== undefined && answers[id] !== null && answers[id] !== "";
    const isFlagged = flagged.includes(index);

    if (isFlagged && !isAnswered) return "Flagged";
    if (isFlagged && isAnswered) return "Answered-Flagged";
    if (isAnswered) return "Answered";
    return "Skipped";
  };

  const answeredCount = questions.filter((q) => answers[q._id]).length;
  const flaggedOnlyCount = flagged.filter((i) => !answers[questions[i]?._id]).length;
  const skippedCount = questions.length - answeredCount;

  const handleFinalSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const name = userInfo.name || "";
    const email = userInfo.email || "";
    const company = userInfo.company || "";
    const startTime = localStorage.getItem("startTime");
    const endTime = Date.now();
    const timeTaken = startTime ? Math.floor((endTime - parseInt(startTime, 10)) / 1000) : null;
    const token = localStorage.getItem("token");

    if (answeredCount !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      const resQuestions = await fetch("http://localhost:5050/api/questions/full", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!resQuestions.ok) {
        throw new Error("Failed to fetch questions");
      }

      const fullQuestions = await resQuestions.json();

      console.log("✅ Full questions received from backend:", fullQuestions);
      console.log("Answers from localStorage:", answers);

      const scoreData = {
        English: 0,
        MathsReasoning: 0,
        Aptitude: 0,
        total: 0,
      };

      fullQuestions.forEach((q) => {
        // Convert _id to string for consistent key matching
        const qid = String(q._id);
        console.log(`QID: ${qid}, correctAnswer: ${q.correctAnswer}`);
        const userAnswer = answers[qid];

        console.log("User's answer:", userAnswer);

        if (userAnswer !== undefined) {
          const isCorrect = userAnswer === q.correctAnswer;
          const score = isCorrect ? 2 : -1;
          scoreData[q.section] += score;
          scoreData.total += score;
        }
      });

      // Ensure no negative scores
      scoreData.English = Math.max(0, scoreData.English);
      scoreData.MathsReasoning = Math.max(0, scoreData.MathsReasoning);
      scoreData.Aptitude = Math.max(0, scoreData.Aptitude);
      scoreData.total = Math.max(0, scoreData.total);

      localStorage.setItem("score", JSON.stringify(scoreData));

      const res = await fetch("http://localhost:5050/api/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          company,
          answers,
          sectionScores: {
            English: scoreData.English,
            MathsReasoning: scoreData.MathsReasoning,
            Aptitude: scoreData.Aptitude,
          },
          totalScore: scoreData.total,
          result: scoreData.total >= 50 ? "Passed" : "Failed",
          timeTaken,
          submissionDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit test");
      }

      console.log("✅ Test submitted:", data);
      navigate("/result");
    } catch (error) {
      console.error("❌ Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    }
  };

  const jumpToQuestion = (index) => {
    localStorage.setItem("jumpTo", index);
    localStorage.setItem("returnToReview", "true");
    navigate("/quiz");
  };

  if (!questions.length) return <div>Loading review page...</div>;

  return (
    <div className="review-container">
      <h2>Review Your Responses</h2>
      <div className="review-grid">
        {questions.map((q, index) => (
          <div
            key={index}
            className={`review-item ${getStatus(index, q._id).toLowerCase()}`}
            onClick={() => jumpToQuestion(index)}
            style={{ cursor: "pointer" }}
          >
            Q{index + 1}: {getStatus(index, q._id).replace("-", " ")}
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
  );
}

export default ReviewPage;
