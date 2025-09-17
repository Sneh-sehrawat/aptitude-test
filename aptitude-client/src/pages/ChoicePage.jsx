import React from 'react';
import { useNavigate } from 'react-router-dom';
import certiEdgeLogo from "../assets/certiedge-removebg-preview.png";

const ChoicePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <img
          src={certiEdgeLogo}
          alt="CertiEdge Logo"
          className="logo-img"
        />

        <div className="text-container">
          <h1 className="title">Welcome!</h1>
          <p className="subtitle">Please choose an option to continue.</p>
        </div>

        <div className="card-container">
          {/* Mock Test Card */}
          <div className="card" onClick={() => navigate('/mock')}>
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

          {/* Quiz Form Card */}
          <div className="card" onClick={() => navigate('/form')}>
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

      {/* Responsive CSS */}
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: 100vh;
            background-color: #e8f5e9;
            padding: 1rem;
            font-family: 'Inter', sans-serif;
            text-align: center;
            position: relative;
          }

          .logo-img {
            position: absolute;
            top: 1rem;
            left: 1rem;
            height: 60px;
            width: auto;
            object-fit: contain;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
          }

          .logo-img:hover {
            transform: scale(1.05);
          }

          .text-container {
            margin-top: 5rem;
            margin-bottom: 2rem;
            padding: 0 1rem;
          }

          .title {
            font-size: clamp(1.8rem, 5vw, 2.5rem);
            font-weight: 800;
            color: #2e7d32;
            margin-bottom: 0.5rem;
          }

          .subtitle {
            font-size: clamp(1rem, 3vw, 1.25rem);
            color: #43a047;
          }

          .card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            width: 100%;
            max-width: 1200px;
            padding: 0 1rem;
          }

          .card {
            flex: 1 1 280px;
            max-width: 350px;
            background-color: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .card:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          }

          .card-image {
            width: 100%;
            max-height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #2e7d32;
            text-align: center;
          }

          .card-subtitle {
            font-size: 0.9rem;
            color: #66bb6a;
            text-align: center;
            margin-top: 0.5rem;
          }

          /* Mobile */
          @media (max-width: 640px) {
            .logo-img {
              height: 50px;
              top: 0.5rem;
              left: 0.5rem;
            }
            .text-container {
              margin-top: 4rem;
            }
          }

          /* Tablet */
          @media (min-width: 641px) and (max-width: 1024px) {
            .card-container {
              gap: 2rem;
            }
          }
        `}
      </style>
    </>
  );
};

export default ChoicePage;
