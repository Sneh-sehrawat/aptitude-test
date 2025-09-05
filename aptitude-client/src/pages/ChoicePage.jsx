import React from 'react';
import { useNavigate } from 'react-router-dom';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png"

// Component for the main choice page
const ChoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <img
          src={certiEdgeLogo}
          alt="CertiEdge Logo"
          className='logo-img'
        />
        
        <div className="text-container">
          <h1 className="title">Welcome!</h1>
          <p className="subtitle">Please choose an option to continue.</p>
        </div>
        <div className="card-container">
          {/* Mock Test Card using navigate */}
          <div className="card mock-test-card" onClick={() => navigate('/mock')}>
            <img
              src="https://placehold.co/300x200/4F46E5/FFFFFF?text=Mock+Test"
              alt="Mock Test Illustration"
              className="card-image"
            />
            <h2 className="card-title">Mock Test</h2>
            <p className="card-subtitle">
              Test your knowledge with a simulated exam environment.
            </p>
          </div>

          {/* Quiz Form Card using navigate */}
          <div className="card quiz-form-card" onClick={() => navigate('/form')}>
            <img
              src="https://placehold.co/300x200/10B981/FFFFFF?text=Quiz+Time"
              alt="Quiz Illustration"
              className="card-image"
            />
            <h2 className="card-title">Quiz Form</h2>
            <p className="card-subtitle">
              Create a new quiz or take a short one.
            </p>
          </div>
        </div>
      </div>
      {/* Vanilla CSS styles are included here for a self-contained component */}
      <style>
        {`
          .container, .page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 91vh;
            background-color: #e8f5e9;
            padding: 1rem;
            font-family: 'Inter', sans-serif;
            text-align: center;
          }
          
          .text-container {
            margin-bottom: 2.5rem;
          }

          .title {
            font-size: 2.25rem;
            font-weight: 800;
            color: #2e7d32;
            margin-bottom: 0.5rem;
          }

          .subtitle {
            font-size: 1.125rem;
            color: #43a047;
          }

          .card-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          @media (min-width: 640px) {
            .card-container {
              flex-direction: row;
            }
          }

          .card {
            width: 20rem;
            height: 24rem;
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .card:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .card-image {
            width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2e7d32;
            text-align: center;
          }

          .card-subtitle {
            font-size: 0.875rem;
            color: #66bb6a;
            text-align: center;
            margin-top: 0.5rem;
          }

          .button {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            color: #ffffff;
            border-radius: 9999px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: transform 0.3s ease, background-color 0.3s ease;
            border: none;
            cursor: pointer;
          }

          .button:hover {
            transform: scale(1.05);
          }

          .mock-test-button {
            background-color: #4caf50;
          }

          .mock-test-button:hover {
            background-color: #388e3c;
          }

          .quiz-form-button {
            background-color: #8bc34a;
          }

          .quiz-form-button:hover {
            background-color: #689f38;
            .logo-img {
  position: absolute;     /* stick to top-left */
  top: 20px;              /* spacing from top */
  left: 20px;             /* spacing from left */
  height: 80px;           /* adjust size to match certiedge.com logo */
  width: auto;            /* keep aspect ratio */
  object-fit: contain;    /* prevent distortion */
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

}
          }
        `}
      </style>
    </>
  );
};

export default ChoicePage;