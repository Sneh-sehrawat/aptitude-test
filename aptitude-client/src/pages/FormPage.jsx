import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./FormPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function FormPage() {
  const [formData, setFormData] = useState({
    college: '',
    stream: '',
    phoneno: '',
    company: '',
    enrollment: '',
    highmarks: '',
    intermarks: '',
    cgpa: '',
    agree: false
  });

  const navigate = useNavigate();

  // ✅ Use environment variable or fallback to Render backend
  const API_BASE = import.meta.env.VITE_API_BASE || "https://aptitude-test-r4l2.onrender.com";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const { stream, enrollment, college, highmarks, intermarks, cgpa, agree } = formData;

    // Required fields check
    if (!college || !stream || !enrollment || !highmarks || !intermarks || !cgpa || !agree) {
      alert('⚠️ Please fill all details and accept the terms.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]{1,50}$/;
    const enrollmentRegex = /^[a-zA-Z0-9]{1,15}$/;
    const percentageRegex = /^(100(\.0+)?|[0-9]{1,2}(\.[0-9]+)?)$/; // 0-100
    const cgpaRegex = /^(10(\.0+)?|[0-9](\.[0-9]+)?)$/; // 0-10 scale

    if (!college || !stream || !enrollment || !highmarks || !intermarks || !cgpa || !agree) {
      alert('⚠️ Please fill all required details and accept the terms.');
      return;
    }

  
// Validation
if (!percentageRegex.test(highmarks)) {
  alert('10th marks must be a number between 0 and 100');
  return;
}
if (parseFloat(highmarks) < 3.3) {
  alert('10th marks must be at least 3.3');
  return;
}

if (!percentageRegex.test(intermarks)) {
  alert('12th marks must be a number between 0 and 100');
  return;
}
if (parseFloat(intermarks) < 3.3) {
  alert('12th marks must be at least 3.3');
  return;
}



if (!nameRegex.test(college)) {
  alert('College name should contain only letters and spaces, max 50 chars');
  return;
}

if (!cgpaRegex.test(cgpa)) {
  alert('College CGPA must be a number between 0 and 10');
  return;
}


if (!nameRegex.test(stream)) {
  alert('Stream should contain only letters and spaces, max 50 chars');
  return;
}


if (!enrollmentRegex.test(enrollment)) {
  alert('Enrollment should be alphanumeric and max 15 characters');
  return;
}

if(enrollment==='0'||enrollment==='00'|enrollment==='000'|enrollment==='0000'|enrollment==='00000'|enrollment==='000000'|enrollment==='0000000'|enrollment==='00000000'|enrollment==='000000000'|enrollment==='0000000000'|enrollment==='00000000000'|enrollment==='000000000000'|enrollment==='0000000000000'|enrollment==='00000000000000'|enrollment==='000000000000000'){
  alert('Invalid Enrollment Number');
  return;
}

    try {
      // Save user info
      localStorage.setItem('userInfo', JSON.stringify(formData));

      // Fetch questions from backend
      const res = await axios.get(`${API_BASE}/api/questions/generate-set`);

      // Save questions locally
      localStorage.setItem('questions', JSON.stringify(res.data));

      // Navigate to quiz page
      navigate("/quiz", { replace: true });
    } catch (err) {
      console.error("Error fetching questions:", err.response?.data || err.message);
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
          <h2>Welcome to CLEAR = The Certiedge Litmus for Engineering Aptitude & Readiness</h2>
          <p>This test is designed to evaluate your aptitude, reasoning, and communication skills. Please ensure the following before you start:</p>
          <ul>
            <li>📌 Complete the test in one sitting (50 minutes duration)</li>
            <li>📌 Do not switch tabs or minimize the window</li>
            <li>📌 Keep your internet connection stable</li>
            <li>📌 You can flag questions to revisit later</li>
            <li>📌 You have only one chance to select the  answer,once selected will not be able to change it </li>
            <li>📌 Please ensure all details are filled correctly. Once submitted, you will not be allowed to make changes.</li>
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
      </div>
    </div>
  );
}

export default FormPage;
