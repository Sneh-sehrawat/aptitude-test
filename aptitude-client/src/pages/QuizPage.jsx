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
  const [timeLeft, setTimeLeft] = useState(50* 60);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  // FULLSCREEN EXIT MODAL
  const [showExitModal, setShowExitModal] = useState(false);

  const reviewMode = sessionStorage.getItem("reviewMode") === "true";
  const API_BASE =
     "https://aptitude-test-1-4le1.onrender.com";

  /* ---------------- HARD EXIT ---------------- */

  const clearAndExit = () => {
    [
      "answers",
      "flagged",
      "quizTimeLeft",
      "jumpTo",
      "reviewMode",
      "questions",
    ].forEach((k) => sessionStorage.removeItem(k));
    sessionStorage.clear();
    navigate("/signup", { replace: true });
  };

  /* ---------------- FULLSCREEN ---------------- */

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
  const token = sessionStorage.getItem("token");
  const info = sessionStorage.getItem("userInfo");

  if (!token) {
    navigate("/login", { replace: true });
  } else if (!info) {
    navigate("/form", { replace: true });
  }
}, [navigate]);


  useEffect(() => {
  if (!questions.length) return;

  const jumpIndex = sessionStorage.getItem("jumpTo");

  if (jumpIndex !== null) {
    setCurrentIndex(Number(jumpIndex));
    sessionStorage.removeItem("jumpTo");
  }
}, [questions]);


  useEffect(() => {
    if (reviewMode || quizFinished) return;

    enterFullscreen();
    window.history.pushState(null, "", window.location.href);

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowExitModal(true);
      }
    };

    const onPopState = () => {
      setShowExitModal(true);
      window.history.pushState(null, "", window.location.href);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, [reviewMode, quizFinished]);

  const resumeTest = () => {
    setShowExitModal(false);
    setTimeout(() => enterFullscreen(), 100);
  };

  /* ---------------- SECURITY ---------------- */

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

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) clearAndExit();
  }, []);

  /* ---------------- LOAD QUESTIONS ---------------- */

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return clearAndExit();

    const loadState = () => {
      setAnswers(JSON.parse(sessionStorage.getItem("answers")) || {});
      setFlagged(JSON.parse(sessionStorage.getItem("flagged")) || []);
      const savedTime = parseInt(sessionStorage.getItem("quizTimeLeft"), 10);
      if (!isNaN(savedTime)) setTimeLeft(savedTime);
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/questions/full`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.length) return clearAndExit();
        setQuestions(data);
        sessionStorage.setItem("questions", JSON.stringify(data));
      } catch {
        clearAndExit();
      }
    };

    loadState();
    fetchQuestions();
  }, [API_BASE]);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (reviewMode || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        sessionStorage.setItem("quizTimeLeft", prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reviewMode, quizFinished]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  /* ---------------- QUIZ ACTIONS ---------------- */

  const handleOptionClick = (opt) => {
    if (reviewMode || quizFinished) return;
    const id = questions[currentIndex]._id;

    setAnswers((prev) => {
      const updated = { ...prev, [id]: opt };
      sessionStorage.setItem("answers", JSON.stringify(updated));
      return updated;
    });

    setSkipped(skipped.filter((i) => i !== currentIndex));
  };

  const skipQuestion = () => {
    if (!skipped.includes(currentIndex))
      setSkipped([...skipped, currentIndex]);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const toggleFlag = () => {
  const qId = questions[currentIndex]._id;

  setFlagged((prev) => {
    let updated;
    if (prev.includes(qId)) {
      updated = prev.filter((id) => id !== qId);
    } else {
      updated = [...prev, qId];
    }

    sessionStorage.setItem("flagged", JSON.stringify(updated));
    return updated;
  });
};


  const mapSectionToScoreKey = (section) => {
  if (!section) return null;

  const s = section.toLowerCase();

 if (s.includes("english")) return "English";

  if (
    s.includes("math") ||
    s.includes("reasoning") ||
    s.includes("logical")
  ) {
    return "MathsReasoning";
  }

  if (
    s.includes("aptitude") ||
    s.includes("analytical") ||
    s.includes("cognitive")
  ) {
    return "Aptitude";
  }

  if( s.includes("computer") || s.includes("fundamental")|| s.includes("programming")|| s.includes("computational")) {
    return "computerFundamentals";
  }

  // Computer + Programming → IGNORE
  return null;
};


 const handleFinalSubmit = async () => {
  setQuizFinished(true);

  // Get user info
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
  const { company, phoneno, college, stream, enrollment, highmarks, intermarks, cgpa } = userInfo;
  const timeTaken = sessionStorage.getItem("timeTaken") || null;
  const token = sessionStorage.getItem("token");

  try {
    // Use state if available, otherwise fallback to sessionStorage
    const questionsToUse = questions.length
      ? questions
      : JSON.parse(sessionStorage.getItem("questions") || "[]");
    const answersToUse = Object.keys(answers).length
      ? answers
      : JSON.parse(sessionStorage.getItem("answers") || "{}");

    if (!questionsToUse.length) {
      alert("Questions not loaded. Cannot submit!");
      return;
    }

    // Calculate score
    const scoreData = { English: 0, MathsReasoning: 0, Aptitude: 0, computerFundamentals: 0, total: 0 };

    
    questionsToUse.forEach((q) => {
      const userAnswer = answersToUse[q._id];
      if (userAnswer) {
        const isCorrect = userAnswer === q.correctAnswer;
        const score = isCorrect ? 2 : -1;
          const bucket = mapSectionToScoreKey(q.section);

  if (bucket) {
    scoreData[bucket] += score;
  }
    scoreData.total += score;
  
      }
    });

    // Save score in localStorage
    sessionStorage.setItem("score", JSON.stringify(scoreData));

    // Submit final test to server
    const response = await fetch(`${API_BASE}/api/submit-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to submit test");

    console.log("✅ Test submitted successfully:", data);
    navigate("/result"); // go to result page
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    alert("Failed to submit test. Please check console for details.");
  }
};




  /* ---------------- AI CHAT ---------------- */

  const askAI = async (question) => {
    if (!question) return;
    setLoading(true);
    const token = sessionStorage.getItem("token");

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
      const exp = data.explanations[question._id];

      setChatMessages((prev) => [
        ...prev,
        { from: "user", text: question.questionText },
        {
          from: "ai",
          text: exp
            ? `AI Picked: ${exp.aiCorrectOption}\n\n${exp.explanation}`
            : "Explanation not found",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { from: "ai", text: "AI failed to respond" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ?._id];

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="quiz-page" style={{ userSelect: "none" }}>
      {showExitModal && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-modal">
            <h2>Exit Test?</h2>
            <p>You tried to leave the test. If you want to exit, your test will be submitted automatically.</p>
            <button onClick={resumeTest}>Resume Test</button>
            <button onClick={handleFinalSubmit}>Exit Test</button>
          </div>
        </div>
      )}

      {!reviewMode && (
        <div className="timer-box">⏰ Time Left: {formatTime(timeLeft)}</div>
      )}

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
            sessionStorage.getItem("canReview") === "true") && (
            <div className="submit-wrapper">
              {!reviewMode ? (
                <button
                  className={`submit-button ${quizFinished ? "locked" : "ready"}`}
                  onClick={() => navigate("/review")}
                  disabled={quizFinished}
                >
                  Review Test
                </button>
              ) : (
                <button
                  className="submit-button finish-review"
                  onClick={() => {
                    sessionStorage.setItem("reviewMode", "false");
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
              className={`flag-button ${flagged.includes(questions[currentIndex]._id) ? "flagged" : ""}`}
              onClick={toggleFlag}
              disabled={reviewMode || quizFinished}
            >
              🚩 {flagged.includes(questions[currentIndex]._id) ? "Flagged" : "Mark Flag"}
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












