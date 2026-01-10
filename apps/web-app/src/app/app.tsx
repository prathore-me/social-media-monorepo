import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';

const Feed = () => <div className="text-center mt-10">Welcome to your Feed!</div>;

export default function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif text-2xl">
        Instagram...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}

      <main className={user ? 'pt-20 px-4' : ''}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
          <Route
            path="/profile/:username"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>
      </main>
    </div>
  );
}
