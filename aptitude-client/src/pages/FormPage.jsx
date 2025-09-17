import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./FormPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png"


function FormPage() {
  const [formData, setFormData] = useState({
    college: '',
    stream: '',
    phoneno: '',
    company: '',
    enrollment: '',
    highmarks:'',
    intermarks:'',
    cgpa:'',
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
    const { stream, enrollment, college, highmarks, intermarks, cgpa} = formData;

    // ✅ Required fields check (only college & stream mandatory)
    if ( !stream || !enrollment|| !college|| !highmarks|| !intermarks|| !cgpa || !formData.agree) {
      alert('⚠️ Please fill in College, Stream and accept the terms.');
      return;
    }

    try {
      // Save user info
      localStorage.setItem('userInfo', JSON.stringify(formData));

      // Fetch questions
      const res = await axios.get('http://localhost:5050/api/questions/generate-set');
      
      // Save questions
      localStorage.setItem('questions', JSON.stringify(res.data));

      // Navigate to quiz
      navigate('/quiz');
    } catch (err) {
      console.error(err);
      alert('❌ Error fetching questions. Please try again.');
    }
  };

  return (
    <div>
    <div className="form-split-container">
      <img
        src={certiEdgeLogo}
        alt="CertiEdge Logo"
        className='logo-img1'
      />
      
      <div className="form-left">
        <h2>Welcome to the Aptitude Test</h2>
        <p>This test is designed to evaluate your aptitude, reasoning, and communication skills. Please ensure the following before you start:</p>
        <ul>
          <li>📌 Complete the test in one sitting (90 minutes duration)</li>
          <li>📌 Do not switch tabs or minimize the window</li>
          <li>📌 Keep your internet connection stable</li>
          <li>📌 You can flag questions to revisit later</li>
          <li>📌 You can use hint maximum of 3 times</li>
          <li>📌 Once submitted, the test cannot be restarted</li>
        </ul>
        <p className="disclaimer">✅ By checking the box, you agree to follow all the test rules and conduct honestly.</p>
      </div>

      <div className="form-right">
        <h3>Enter Your Details</h3>
         <input type="text" name="highmarks" placeholder="📊 10th Percentage/cgpa" onChange={handleChange} />
          <input type="text" name="intermarks" placeholder="📊 12th Percentage/cgpa" onChange={handleChange} />
        <input type="text" name="college" placeholder="🏫 College" onChange={handleChange} />
         <input type="text" name="cgpa" placeholder="📊 College CGPA" onChange={handleChange} />
        <input type="text" name="stream" placeholder="📚 Stream" onChange={handleChange} />
        <input type="text" name="enrollment" placeholder="🆔 Enrollment Number" onChange={handleChange} />

        <label className="checkbox-label">
          <input type="checkbox" name="agree" onChange={handleChange} /> I accept all terms and agree to proceed
        </label>

        <button onClick={handleSubmit}>🚀 Start Test</button>
      </div>
    </div></div>
  );
}

export default FormPage;
