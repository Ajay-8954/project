import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { LogIn, UserPlus, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user,
    loading,
    setAuth,
    setLoading,
    logout,
  } = useAuthStore();
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:5000/api/auth/validate',
          { withCredentials: true }
        );
        if (response.data.valid) {
          setAuth(true, response.data.user);
        }
      } catch (error) {
        setAuth(false, null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuth, setLoading]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-gray-50 shadow-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-blue-600 transition-transform duration-300 hover:scale-105">
          Resumex.io
        </h1>
        <div className="w-20 sm:w-24"></div>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-gray-50 shadow-md">
      <h1
        className="text-xl sm:text-2xl font-extrabold text-blue-600 cursor-pointer transition-transform duration-300 hover:scale-105 hover:text-blue-700"
        onClick={() => navigate('/')}
      >
        Resumex.io
      </h1>

      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium hidden sm:inline">
              Welcome, {user?.username}
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 sm:gap-2 text-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
              disabled={logoutLoading}
            >
              <PlusCircle size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <div className="flex items-center gap-1 sm:gap-2 animate-pulse">
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="hidden xs:inline">Logging Out...</span>
                </div>
              ) : (
                <>
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Logout</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1 sm:gap-2 text-blue-600 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
            >
              <LogIn size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Login</span>
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
            >
              <UserPlus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Sign Up</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;