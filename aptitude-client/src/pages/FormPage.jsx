import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./FormPage.css";
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

function FormPage() {
  const [formData, setFormData] = useState({
    college: 'RATHINAM INSTITUTE OF TECHNOLOGY',
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
  const API_BASE = "https://aptitude-test-1-4le1.onrender.com";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const { stream, enrollment, highmarks, intermarks, cgpa, agree } = formData;

    if (!stream || !enrollment || !highmarks || !intermarks || !cgpa || !agree) {
      alert('⚠️ Please fill all details and accept the terms.');
      return;
    }

    const enrollmentRegex = /^[a-zA-Z0-9]{1,15}$/;
    const percentageRegex = /^(100(\.0+)?|[0-9]{1,2}(\.[0-9]+)?)$/;
    const cgpaRegex = /^(10(\.0+)?|[0-9](\.[0-9]+)?)$/;
    const nameRegex = /^[a-zA-Z\s]{1,50}$/;

    if (!percentageRegex.test(highmarks) || parseFloat(highmarks) < 3.3) {
      alert('10th marks must be between 3.3 and 100');
      return;
    }
    if (!percentageRegex.test(intermarks) || parseFloat(intermarks) < 3.3) {
      alert('12th marks must be between 3.3 and 100');
      return;
    }
    if (!cgpaRegex.test(cgpa)) {
      alert('College CGPA must be between 0 and 10');
      return;
    }
    if (!nameRegex.test(stream)) {
      alert('Stream should contain only letters and spaces');
      return;
    }
    if (!enrollmentRegex.test(enrollment)) {
      alert('Enrollment should be alphanumeric (max 15 chars)');
      return;
    }

    try {
      sessionStorage.setItem('userInfo', JSON.stringify(formData));
      const res = await axios.get(`${API_BASE}/api/questions/generate-set`);
      sessionStorage.setItem('questions', JSON.stringify(res.data));
      navigate("/quiz", { replace: true });
    } catch (err) {
      console.error(err);
      alert('❌ Error fetching questions. Please try again.');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const info = sessionStorage.getItem("userInfo");
    if (info) {
      navigate("/quiz", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="form-split-container">
      <img src={certiEdgeLogo} alt="CertiEdge Logo" className="logo-img1" />

      <div className="form-left">
        <h2>Welcome to CLEAR = The Certiedge Litmus for Engineering Aptitude & Readiness</h2>
        <p>This test is designed to evaluate your aptitude, reasoning, and communication skills. Please ensure the following before you start:</p>
        <ul>
          <li>Complete the test in one sitting (50 minutes)</li>
          <li>Do not switch tabs or minimize the window</li>
          <li>Keep your internet connection stable</li>
          <li>You can flag questions to revisit later</li>
          <li>Only one chance to select the answer</li>
          <li>Ensure all details are correct before submission</li>
          <li>Test cannot be restarted once submitted</li>
        </ul>
        <p className="disclaimer">✅ By checking the box, you agree to follow all test rules honestly.</p>
      </div>

      <div className="form-right">
        <h3>Enter Your Details</h3>

        <div className="form-group">
          <label>10th Percentage / CGPA</label>
          <input type="text" name="highmarks" placeholder="Enter 10th marks" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>12th Percentage / CGPA</label>
          <input type="text" name="intermarks" placeholder="Enter 12th marks" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>College Name</label>
          <input
            type="text"
            value="RATHINAM INSTITUTE OF TECHNOLOGY"
            disabled
          />
        </div>

        <div className="form-group">
          <label>College CGPA</label>
          <input type="text" name="cgpa" placeholder="Enter your CGPA" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Stream</label>
          <input type="text" name="stream" placeholder="Enter your stream" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Enrollment Number</label>
          <input type="text" name="enrollment" placeholder="Enter enrollment number" onChange={handleChange} />
        </div>

        <label className="checkbox-label">
          <input type="checkbox" name="agree" onChange={handleChange} /> I accept all terms and agree to proceed
        </label>

        <button onClick={handleSubmit}>🚀 Start Test</button>
      </div>
    </div>
  );
}

export default FormPage;


