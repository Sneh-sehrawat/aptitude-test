import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';

function MockTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [numhintsused, setNumHintsUsed] = useState(0);
  const [idshowhint, setIdShowHint] = useState([]);
  const [showAnswerMap, setShowAnswerMap] = useState({});
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const STORAGE_PREFIX = "mock_";
  const reviewMode = localStorage.getItem(`${STORAGE_PREFIX}reviewMode`) === 'true';

  // ✅ Disable copy/paste/right-click
  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener('contextmenu', block);
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('paste', block);
    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('paste', block);
    };
  }, []);

  // ✅ Load questions + stored answers
  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}answers`)) || {};
    const storedFlagged = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}flagged`)) || [];
    const jumpIndex = parseInt(localStorage.getItem(`${STORAGE_PREFIX}jumpTo`), 10);
    const shouldReturn = localStorage.getItem(`${STORAGE_PREFIX}returnToReview`) === "true";
    const token = localStorage.getItem("token");

    const fetchFullQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/questions/mock/full", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const fullQ = await res.json();
        if (!fullQ.length) return navigate("/");
        setQuestions(fullQ);
      } catch (err) {
        console.error("❌ Failed to fetch full questions:", err);
        navigate("/");
      }
    };

    fetchFullQuestions();
    setAnswers(storedAnswers);
    setFlagged(storedFlagged);

    if (!isNaN(jumpIndex)) {
      setCurrentIndex(jumpIndex);
      localStorage.removeItem(`${STORAGE_PREFIX}jumpTo`);
    }

    if (shouldReturn) {
      localStorage.removeItem(`${STORAGE_PREFIX}returnToReview`);
      localStorage.setItem(`${STORAGE_PREFIX}canReview`, "true");
    }
  }, [navigate]);

  // ✅ Timer for quiz mode
  useEffect(() => {
    if (reviewMode) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleReview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [reviewMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ✅ Select option
  const handleOptionClick = (selected) => {
    if (reviewMode) return;
    const id = questions[currentIndex]._id;
    setAnswers((prev) => {
      const newAns = { ...prev, [id]: selected };
      localStorage.setItem(`${STORAGE_PREFIX}answers`, JSON.stringify(newAns));
      return newAns;
    });
    if (skipped.includes(currentIndex)) {
      setSkipped(skipped.filter((i) => i !== currentIndex));
    }
  };

  const skipQuestion = () => {
    if (!skipped.includes(currentIndex)) setSkipped([...skipped, currentIndex]);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (reviewMode && currentIndex === questions.length - 1) {
      localStorage.removeItem(`${STORAGE_PREFIX}reviewMode`);
      navigate("/result");
    }
    setShowHint(false);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    setShowHint(false);
  };

  const toggleFlag = () => {
    if (flagged.includes(currentIndex)) {
      setFlagged(flagged.filter((i) => i !== currentIndex));
    } else {
      setFlagged([...flagged, currentIndex]);
    }
  };

  const handleReview = () => {
    localStorage.setItem(`${STORAGE_PREFIX}answers`, JSON.stringify(answers));
    localStorage.setItem(`${STORAGE_PREFIX}flagged`, JSON.stringify(flagged));
    localStorage.setItem(`${STORAGE_PREFIX}questions`, JSON.stringify(questions));

    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("flagged", JSON.stringify(flagged));
    localStorage.setItem("questions", JSON.stringify(questions));

    setTimeout(() => navigate("/mockreview"), 300);
  };

  const handleCheckAnswer = () => {
    if (!reviewMode) {
      const id = questions[currentIndex]._id;
      setShowAnswerMap((prev) => ({ ...prev, [id]: true }));
    }
  };

  // ✅ AI Helper
  const askAI = async (question) => {
    if (!question) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5050/api/gemini/explain-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          questions: [
            {
              _id: question._id,
              question: question.questionText,
              options: question.options,
              correctAnswer: question.correctAnswer,
              userAnswer: answers[question._id] || null,
            },
          ],
        }),
      });
      const data = await res.json();
      const explanationData = data.explanations[question._id];

      if (explanationData) {
        setChatMessages((prev) => [
          ...prev,
          { from: "user", text: `Explain Q${currentIndex + 1}: ${question.questionText}` },
          {
            from: "ai",
            text: `AI Picked: ${explanationData.aiCorrectOption}\n\nExplanation: ${explanationData.explanation}`,
          },
        ]);
      } else {
        setChatMessages((prev) => [...prev, { from: "ai", text: "⚠️ No explanation available." }]);
      }
    } catch (err) {
      console.error("AI error:", err);
      setChatMessages((prev) => [...prev, { from: "ai", text: "⚠️ Failed to fetch explanation." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!questions.length) return null;

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ._id];
  const showCorrect = showAnswerMap[currentQ._id] || reviewMode;

  return (
    <div className="quiz-page" style={{ userSelect: "none" }}>
      {!reviewMode && <div className="timer-box">⏰ Time Left: {formatTime(timeLeft)}</div>}

      <div className="quiz-header">
        <h1>Mock Test</h1>
        <p>
          Total Questions: {questions.length} | Type:{" "}
          {currentIndex < 4 ? "Quiz" : "Mock"}
        </p>
      </div>

      <div className="quiz-wrapper">
        <div className="quiz-left">
          <div className="left-top">
            <h3 className="section-heading">Section: {currentQ.section}</h3>
            <h2>Question {currentIndex + 1}</h2>
            <p className="question-text">{currentQ.questionText}</p>

            {!reviewMode && currentQ.hint && (
              <>
                <div
                  className="hint-toggle"
                  onClick={() => {
                    if (numhintsused < 3) {
                      setShowHint((prev) => !prev);
                      if (!idshowhint.includes(currentIndex)) {
                        setNumHintsUsed(numhintsused + 1);
                        setIdShowHint([...idshowhint, currentIndex]);
                      }
                    } else {
                      alert("You have used all your hints");
                    }
                  }}
                >
                  💡 {showHint ? "Hide Hint" : "Show Hint"}
                </div>
                {showHint && <p className="hint-box">💡 {currentQ.hint}</p>}
              </>
            )}
          </div>

          {(currentIndex === questions.length - 1 ||
            localStorage.getItem(`${STORAGE_PREFIX}canReview`) === "true") && (
            <div className="submit-wrapper">
              <button
                className={`submit-button ${reviewMode ? "locked" : "ready"}`}
                onClick={() => {
                  if (reviewMode) return;
                  localStorage.setItem(`${STORAGE_PREFIX}canReview`, "true");
                  localStorage.setItem(`${STORAGE_PREFIX}answers`, JSON.stringify(answers));
                  localStorage.setItem(`${STORAGE_PREFIX}flagged`, JSON.stringify(flagged));
                  localStorage.setItem(`${STORAGE_PREFIX}questions`, JSON.stringify(questions));
                  navigate("/mockreview");
                }}
                disabled={reviewMode}
              >
                Review Test
              </button>
              {reviewMode && <p className="review-note">🔍 You are in review mode</p>}
            </div>
          )}
        </div>

        <div className="quiz-right">
          <div className="options">
            {currentQ.options.map((opt, idx) => {
              let resultClass = "";
              if (showCorrect) {
                if (opt === currentQ.correctAnswer) resultClass = "correct";
                else if (selectedAnswer === opt && opt !== currentQ.correctAnswer)
                  resultClass = "incorrect";
              } else if (selectedAnswer === opt) {
                resultClass = "selected";
              }

              return (
                <button
                  key={idx}
                  className={`option-button ${resultClass}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={reviewMode}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="bottom-buttons">
            <button onClick={prevQuestion} disabled={currentIndex === 0}>
              Prev
            </button>
            <button onClick={skipQuestion} disabled={reviewMode}>
              Skip
            </button>
            <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1}>
              Next
            </button>
            <button
              className={`flag-button ${flagged.includes(currentIndex) ? "flagged" : ""}`}
              onClick={toggleFlag}
              disabled={reviewMode}
            >
              🚩 {flagged.includes(currentIndex) ? "Flagged" : "Mark Flag"}
            </button>
            <button
              className="check-answer-button"
              onClick={handleCheckAnswer}
              disabled={reviewMode}
            >
              Check Answer
            </button>
            {reviewMode && currentIndex === questions.length - 1 && (
              <button
                className="submit-button ready"
                onClick={() => {
                  localStorage.removeItem(`${STORAGE_PREFIX}reviewMode`);
                  navigate("/result");
                }}
                style={{ marginTop: "10px" }}
              >
                Finish Review
              </button>
            )}
          </div>
        </div>
      </div>

      {reviewMode && (
        <>
          {!isChatMinimized ? (
            <div className="chatbot-wrapper">
              <div className="chat-window">
                <div className="chat-header">
                  AI Helper
                  <button
                    className="chat-minimize-btn"
                    onClick={() => setIsChatMinimized(true)}
                  >
                    ❌
                  </button>
                </div>
                <div className="chat-body">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-msg ${msg.from}`}>
                      {msg.text}
                    </div>
                  ))}
                  {loading && <p>⏳ Loading...</p>}
                </div>
                <div className="chat-footer">
                  <button onClick={() => askAI(currentQ)}>Explain This Question</button>
                </div>
              </div>
            </div>
          ) : (
            <button className="chat-maximize-btn" onClick={() => setIsChatMinimized(false)}>
              💬
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default MockTest;
