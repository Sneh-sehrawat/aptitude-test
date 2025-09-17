import React, { useState, useEffect } from "react";
import "../styles/EditQuestions.css"; // 👈 new isolated CSS file
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

const AdminQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    section: "",
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    hint: "",
    type: "quiz",
  });

  // ✅ Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e, index) => {
    if (index !== undefined) {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = e.target.value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // ✅ Create / Update question
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.section || !formData.questionText || formData.options.some((opt) => opt.trim() === "")) {
      alert("⚠️ Please fill all fields properly.");
      return;
    }

    try {
      if (editingId) {
        // 🔄 Update existing
        const res = await fetch(`/api/questions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          alert("✅ Question updated!");
          setEditingId(null);
        } else {
          alert("❌ Failed to update.");
        }
      } else {
        // ➕ Create new
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          alert("✅ Question added!");
        } else {
          alert("❌ Failed to add.");
        }
      }

      // Reset form
      setFormData({
        section: "",
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        hint: "",
        type: "quiz",
      });

      fetchQuestions();
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    }
  };

  // ✅ Edit
  const handleEdit = (q) => {
    setFormData({
      section: q.section,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      hint: q.hint,
      type: q.type,
    });
    setEditingId(q._id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Delete this question?")) return;

    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Deleted!");
        fetchQuestions();
      } else {
        alert("❌ Failed to delete.");
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
    }
  };

  return (
    <div className="question-admin-container">
        <img src={certiEdgeLogo} alt="CertiEdge Logo" className='logo-img' />
      <h2 className="question-admin-title">Manage Questions</h2>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="question-admin-form">
        <input
          type="text"
          name="section"
          placeholder="Section (e.g., English, Maths)"
          value={formData.section}
          onChange={handleChange}
          required
          className="question-admin-input"
        />

        <input
          type="text"
          name="questionText"
          placeholder="Enter question"
          value={formData.questionText}
          onChange={handleChange}
          required
          className="question-admin-input"
        />

        {formData.options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleChange(e, i)}
            required
            className="question-admin-input"
          />
        ))}

        <select
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleChange}
          required
          className="question-admin-select"
        >
          <option value="">Select Correct Answer</option>
          {formData.options.map((opt, i) => (
            <option key={i} value={opt}>
              {`Option ${i + 1}: ${opt}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="hint"
          placeholder="Hint (optional)"
          value={formData.hint}
          onChange={handleChange}
          className="question-admin-input"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="question-admin-select"
        >
          <option value="quiz">Quiz</option>
          <option value="mock">Mock</option>
        </select>

        <button type="submit" className="question-admin-button">
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

      {/* ✅ List */}
      <h3 className="question-admin-subtitle">Existing Questions</h3>
      <ul className="question-admin-list">
        {questions.map((q) => (
          <li key={q._id} className="question-admin-list-item">
            <div>
              <strong>{q.section}:</strong> {q.questionText} <br />
              Options: {q.options.join(", ")} <br />
              ✅ Correct: {q.correctAnswer} | 💡 {q.hint} | 📌 {q.type}
            </div>
            <div className="question-admin-actions">
              <button onClick={() => handleEdit(q)} className="question-admin-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(q._id)} className="question-admin-delete">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminQuestionPage;

