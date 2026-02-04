import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SymptomCheck from './pages/SymptomCheck';
import Profile from './pages/Profile';
import History from './pages/History';
import Analytics from './pages/Analytics';
import FindDoctors from './pages/FindDoctors';
import HealthMetrics from './pages/HealthMetrics';
import MedicationTracker from './pages/MedicationTracker';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/check-symptoms"
                element={
                  <PrivateRoute>
                    <SymptomCheck />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/find-doctors"
                element={
                  <PrivateRoute>
                    <FindDoctors />
                  </PrivateRoute>
                }
              />
              <Route
                path="/metrics"
                element={
                  <PrivateRoute>
                    <HealthMetrics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/medications"
                element={
                  <PrivateRoute>
                    <MedicationTracker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PrivateRoute>
                    <Appointments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/book-appointment"
                element={
                  <PrivateRoute>
                    <BookAppointment />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)', borderTop: '1px solid var(--border)' }}>
            &copy; {new Date().getFullYear()} VitallQ. Informational Use Only.
          </footer>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
