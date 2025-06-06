import { Routes, Route, Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ReviewPage from './pages/ReviewPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import AdminPage from "./pages/AdminPage";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes for logged-in users */}
      <Route 
        path="/form" 
        element={
          <ProtectedRoute>
            <FormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quiz" 
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/result" 
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/review" 
        element={
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        } 
      />

      {/* Admin route - can also protect similarly if you want */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
