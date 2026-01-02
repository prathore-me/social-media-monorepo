import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Profile from './pages/profile/profile';

export function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/profile/:username"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
      />

      <Route path="/" element={<Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;
