import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FormPage.css';

function FormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    cgpa: '',
    enrollment: '',
    agree: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const { name, email, company, enrollment, agree } = formData;

    if (!name || !email || !company || !enrollment || !agree) {
      alert('⚠️ Please fill in all required fields and accept the terms.');
      return;
    }

    try {
      localStorage.setItem('userInfo', JSON.stringify(formData));
      const res = await axios.get('http://localhost:5050/api/questions/generate-set');
      localStorage.setItem('questions', JSON.stringify(res.data));
      navigate('/quiz');
    } catch (err) {
      console.error(err);
      alert('Error fetching questions. Please try again.');
    }
  };

  return (
    <div className="form-split-container">
      <div className="form-left">
        <h2>Welcome to the Aptitude Test</h2>
        <p>This test is designed to evaluate your aptitude, reasoning, and communication skills. Please ensure the following before you start:</p>
        <ul>
          <li>📌 Complete the test in one sitting (90 minutes duration)</li>
          <li>📌 Do not switch tabs or minimize the window</li>
          <li>📌 Keep your internet connection stable</li>
          <li>📌 You can flag questions to revisit later</li>
          <li>📌 Once submitted, the test cannot be restarted</li>
        </ul>
        <p className="disclaimer">✅ By checking the box, you agree to follow all the test rules and conduct honestly.</p>
      </div>

      <div className="form-right">
        <h3>Enter Your Details</h3>
        <input type="text" name="name" placeholder="👤 Full Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="📧 Email" onChange={handleChange} />
        <input type="text" name="company" placeholder="🏢 Company" onChange={handleChange} />
        <input type="text" name="cgpa" placeholder="🎓 College CGPA (Optional)" onChange={handleChange} />
        <input type="text" name="enrollment" placeholder="🆔 Enrollment Number" onChange={handleChange} />

        <label className="checkbox-label">
          <input type="checkbox" name="agree" onChange={handleChange} /> I accept all terms and agree to proceed
        </label>

        <button onClick={handleSubmit}>🚀 Start Test</button>
      </div>
    </div>
  );
}

export default FormPage;
