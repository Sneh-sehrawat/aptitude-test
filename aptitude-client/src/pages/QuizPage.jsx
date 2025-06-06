import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuizPage.css';

function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [skipped, setSkipped] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const reviewMode = localStorage.getItem('reviewMode') === 'true';

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem("questions"));
    const a = JSON.parse(localStorage.getItem("answers")) || {};
    const f = JSON.parse(localStorage.getItem("flagged")) || [];
    const jumpIndex = parseInt(localStorage.getItem("jumpTo"), 10);
    const shouldReturn = localStorage.getItem("returnToReview") === "true";

    if (!q || !q.length) return navigate("/");

    setQuestions(q);
    setAnswers(a);
    setFlagged(f);

    if (!isNaN(jumpIndex)) {
      setCurrentIndex(jumpIndex);
      localStorage.removeItem("jumpTo");
    }

    if (shouldReturn) {
      localStorage.removeItem("returnToReview");
      localStorage.setItem("canReview", "true");
    }
  }, [navigate]);

  useEffect(() => {
    if (reviewMode) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  const handleOptionClick = (selected) => {
    if (reviewMode) return;
    const id = questions[currentIndex]._id;
    setAnswers(prev => ({ ...prev, [id]: selected }));
    if (skipped.includes(currentIndex)) {
      setSkipped(skipped.filter(i => i !== currentIndex));
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
      localStorage.removeItem("reviewMode");
      navigate("/result");
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const toggleFlag = () => {
    if (flagged.includes(currentIndex)) {
      setFlagged(flagged.filter(i => i !== currentIndex));
    } else {
      setFlagged([...flagged, currentIndex]);
    }
  };

  const handleReview = () => {
    localStorage.setItem('answers', JSON.stringify(answers));
    localStorage.setItem('flagged', JSON.stringify(flagged));
    localStorage.setItem('questions', JSON.stringify(questions));
    setTimeout(() => navigate("/review"), 300);
  };

  if (!questions.length) return <div>Loading...</div>;
  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ._id];

  return (
    <>
      {!reviewMode && <div className="timer-box">⏰ Time Left: {formatTime(timeLeft)}</div>}

      <div className="quiz-header">
        <h1>Aptitude Test</h1>
        <p>Total Questions: {questions.length}</p>
      </div>

      <div className="quiz-wrapper">
        <div className="quiz-left">
          <div className="left-top">
            <h3 className="section-heading">Section: {currentQ.section}</h3>
            <h2>Ques {currentIndex + 1}</h2>
            <p className="question-text">{currentQ.questionText}</p>
          </div>

          {(currentIndex === questions.length - 1 || localStorage.getItem("canReview") === "true") && (
            <div className="submit-wrapper">
              <button
                className={`submit-button ${reviewMode ? 'locked' : 'ready'}`}
                onClick={() => {
                  if (reviewMode) return;
                  localStorage.setItem("canReview", "true");
                  localStorage.setItem("answers", JSON.stringify(answers));
                  localStorage.setItem("flagged", JSON.stringify(flagged));
                  localStorage.setItem("questions", JSON.stringify(questions));
                  navigate("/review");
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
              if (reviewMode) {
                if (opt === currentQ.correctAnswer) {
                  resultClass = "correct";
                } else if (selectedAnswer === opt && opt !== currentQ.correctAnswer) {
                  resultClass = "incorrect";
                }
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
            <button onClick={prevQuestion} disabled={currentIndex === 0}>Prev</button>
            <button onClick={skipQuestion} disabled={reviewMode}>Skip</button>
            <button onClick={nextQuestion} disabled={currentIndex === questions.length - 1}>Next</button>
            <button
              className={`flag-button ${flagged.includes(currentIndex) ? 'flagged' : ''}`}
              onClick={toggleFlag}
              disabled={reviewMode}
            >
              🚩 {flagged.includes(currentIndex) ? 'Flagged' : 'Mark Flag'}
            </button>
            {reviewMode && currentIndex === questions.length - 1 && (
  <button
    className="submit-button ready"
    onClick={() => {
      localStorage.removeItem("reviewMode");
      navigate("/result");
    }}
    style={{ marginTop: '10px' }}
  >
    Finish Review
  </button>
)}

          </div>
        </div>
      </div>
    </>
  );
}

export default QuizPage;
