import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuizPage.css";

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  
  
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 mins
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  const reviewMode = localStorage.getItem("reviewMode") === "true";
  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://aptitude-test-r4l2.onrender.com";

  // --- Hard exit / leave quiz ---
  const leaveQuiz = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to leave the quiz? All progress will be lost."
      )
    ) {
      localStorage.clear();
      navigate("/signup", { replace: true });
    }
  };

  // --- Check token on mount ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) leaveQuiz();
  }, []);

  // --- Prevent copy/paste/right-click ---
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
    };
  }, []);

  // --- Prevent back/refresh during quiz ---
  useEffect(() => {
    if (reviewMode) return;

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
  }, [reviewMode]);
useEffect(() => {
  if (reviewMode || quizFinished) return;

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request failed:", err);
      });
    }
  };

  const clearAndLeave = () => {
    // Clear all quiz data
    ["answers", "flagged", "quizTimeLeft", "jumpTo", "reviewMode", "questions"].forEach(k => localStorage.removeItem(k));
    navigate("/signup", { replace: true });
  };

  enterFullscreen();

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      const leave = window.confirm(
        "⚠️ You pressed ESC or tried to exit fullscreen.\nDo you want to leave the test?"
      );
      if (leave) {
        clearAndLeave();
      } else {
        enterFullscreen();
      }
    }
  };

  const handlePopState = () => {
    const leave = window.confirm(
      "⚠️ You tried to leave using the back button.\nDo you want to exit the test?"
    );
    if (leave) {
      clearAndLeave();
    } else {
      window.history.pushState(null, "", window.location.href); // cancel back
      enterFullscreen();
    }
  };

  // Prevent back button from leaving
  window.history.pushState(null, "", window.location.href);

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  window.addEventListener("popstate", handlePopState);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    window.removeEventListener("popstate", handlePopState);
  };
}, [reviewMode, quizFinished]);

  // --- Load questions & state ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return leaveQuiz();

    const loadState = () => {
      setAnswers(JSON.parse(localStorage.getItem("answers")) || {});
      
      
      setFlagged(JSON.parse(localStorage.getItem("flagged")) || []);
      const jumpIndex = parseInt(localStorage.getItem("jumpTo"), 10);
      if (!isNaN(jumpIndex)) {
        setCurrentIndex(jumpIndex);
        localStorage.removeItem("jumpTo");
      }
      const savedTime = parseInt(localStorage.getItem("quizTimeLeft"), 10);
      if (!isNaN(savedTime)) setTimeLeft(savedTime);
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/questions/full`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.length) return leaveQuiz();
        setQuestions(data);
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err);
        leaveQuiz();
      }
    };

    loadState();
    fetchQuestions();
  }, [API_BASE]);

  // --- Timer ---
  useEffect(() => {
    if (reviewMode || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        localStorage.setItem("quizTimeLeft", prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reviewMode, quizFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // --- Quiz actions ---
  const handleOptionClick = (selected) => {
    if (reviewMode || quizFinished) return;

    const id = questions[currentIndex]._id;
    // Only one change allowed

    setAnswers((prev) => {
      const newAns = { ...prev };
      newAns[id] = selected;

      // Lock the answer after first change
      

      localStorage.setItem("answers", JSON.stringify(newAns));
      return newAns;
    });

    if (skipped.includes(currentIndex))
      setSkipped(skipped.filter((i) => i !== currentIndex));
  };

  const skipQuestion = () => {
    if (!skipped.includes(currentIndex)) setSkipped([...skipped, currentIndex]);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const toggleFlag = () => {
    if (flagged.includes(currentIndex))
      setFlagged(flagged.filter((i) => i !== currentIndex));
    else setFlagged([...flagged, currentIndex]);
  };

  const finishQuiz = () => {
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("flagged", JSON.stringify(flagged));
    localStorage.setItem("questions", JSON.stringify(questions));
    setQuizFinished(true);
    navigate("/review", { replace: true });
  };

  // --- AI Chatbot ---
  const askAI = async (question) => {
    if (!question) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/gemini/explain-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        setChatMessages((prev) => [...prev, { from: "ai", text: "⚠️ Explanation not found." }]);
      }
    } catch (err) {
      console.error("AI error:", err);
      setChatMessages((prev) => [...prev, { from: "ai", text: "⚠️ Failed to fetch explanation." }]);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ?._id];
  
  
  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="quiz-page" style={{ userSelect: "none" }}>
      {!reviewMode && <div className="timer-box">⏰ Time Left: {formatTime(timeLeft)}</div>}

      <div className="quiz-header">
        <h1>Aptitude Test</h1>
        <p>Total Questions: {questions.length}</p>
      </div>

      <div className="quiz-wrapper">
        <div className="quiz-left">
          <div className="left-top">
            <h3 className="section-heading">Section: {currentQ.section}</h3>
            <h2>Question {currentIndex + 1}</h2>
            <p className="question-text">{currentQ.questionText}</p>
          </div>

          {(currentIndex === questions.length - 1 ||
            localStorage.getItem("canReview") === "true") && (
            <div className="submit-wrapper">
              {!reviewMode ? (
                <button
                  className={`submit-button ${quizFinished ? "locked" : "ready"}`}
                  onClick={finishQuiz}
                  disabled={quizFinished}
                >
                  Review Test
                </button>
              ) : (
                <button
                  className="submit-button finish-review"
                  onClick={() => {
                    localStorage.setItem("reviewMode", "false");
                    navigate("/result", { replace: true });
                  }}
                >
                  Finish Review
                </button>
              )}
            </div>
          )}
        </div>

        <div className="quiz-right">
          <div className="options">
            {currentQ.options.map((opt, idx) => {
              let resultClass = "";

              if (reviewMode) {
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
                  disabled={reviewMode || quizFinished }
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="bottom-buttons">
            <button onClick={prevQuestion} disabled={currentIndex === 0 || quizFinished}>
              Prev
            </button>
            <button onClick={skipQuestion} disabled={reviewMode || quizFinished}>
              Skip
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1 || quizFinished}
            >
              Next
            </button>
            <button
              className={`flag-button ${flagged.includes(currentIndex) ? "flagged" : ""}`}
              onClick={toggleFlag}
              disabled={reviewMode || quizFinished}
            >
              🚩 {flagged.includes(currentIndex) ? "Flagged" : "Mark Flag"}
            </button>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
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

export default QuizPage;






