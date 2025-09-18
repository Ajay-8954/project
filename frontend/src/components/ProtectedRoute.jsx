import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/validate', 
          { withCredentials: true }
        );
        
        if (response.data.valid) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
       <div style={styles.container}>
        <div style={styles.loader}>
          <div style={styles.logo}>
            <svg viewBox="0 0 100 100" style={styles.logoSvg}>
              <path d="M50 10 L72 30 L65 55 L35 55 L28 30 Z" fill="#6D28D9" />
              <circle cx="50" cy="40" r="10" fill="#8B5CF6" />
            </svg>
          </div>
          
          <div style={styles.orbitalSystem}>
            <div style={{...styles.orbit, ...styles.orbit1}}>
              <div style={{...styles.planet, ...styles.planet1}}></div>
            </div>
            <div style={{...styles.orbit, ...styles.orbit2}}>
              <div style={{...styles.planet, ...styles.planet2}}></div>
            </div>
            <div style={{...styles.orbit, ...styles.orbit3}}>
              <div style={{...styles.planet, ...styles.planet3}}></div>
            </div>
            <div style={styles.sun}></div>
          </div>
          
          <h2 style={styles.title}>Verifying Your Session</h2>
          <p style={styles.text}>Just a moment while we check your credentials...</p>
          
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}></div>
          </div>
          
          <div style={styles.dots}>
            <div style={styles.dot}></div>
            <div style={styles.dot}></div>
            <div style={styles.dot}></div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet context={{ user }} /> : <Navigate to="/login" />;
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #fae7ff 50%, #e0f2fe 75%, #f0f9ff 100%)',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  },
  loader: {
    textAlign: 'center',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%'
  },
  logo: {
    marginBottom: '30px'
  },
  logoSvg: {
    width: '70px',
    height: '70px',
    filter: 'drop-shadow(0 5px 10px rgba(109, 40, 217, 0.2))'
  },
  orbitalSystem: {
    position: 'relative',
    width: '180px',
    height: '180px',
    margin: '0 auto 30px'
  },
  orbit: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    border: '1px solid #DDD6FE',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
  },
  orbit1: {
    width: '180px',
    height: '180px',
    animation: 'spin 8s linear infinite'
  },
  orbit2: {
    width: '120px',
    height: '120px',
    animation: 'spin 6s linear infinite reverse'
  },
  orbit3: {
    width: '60px',
    height: '60px',
    animation: 'spin 4s linear infinite'
  },
  planet: {
    position: 'absolute',
    top: '0',
    left: '50%',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
  },
  planet1: {
    background: '#7E22CE',
    boxShadow: '0 0 10px #7E22CE'
  },
  planet2: {
    background: '#3B82F6',
    boxShadow: '0 0 10px #3B82F6'
  },
  planet3: {
    background: '#EC4899',
    boxShadow: '0 0 10px #EC4899'
  },
  sun: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '30px',
    height: '30px',
    background: 'linear-gradient(45deg, #F59E0B, #F97316)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 20px #F59E0B'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '15px',
    color: '#4C1D95',
    fontWeight: '600'
  },
  text: {
    fontSize: '1rem',
    marginBottom: '25px',
    color: '#6B7280'
  },
  progressContainer: {
    width: '100%',
    height: '6px',
    background: '#E5E7EB',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '20px auto'
  },
  progressBar: {
    height: '100%',
    width: '50%',
    background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
    borderRadius: '10px',
    animation: 'loading 2s infinite ease-in-out'
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  dot: {
    width: '10px',
    height: '10px',
    background: '#8B5CF6',
    borderRadius: '50%',
    margin: '0 5px',
    animation: 'bounce 1.5s infinite ease-in-out'
  }
};

// Add the keyframes to the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes loading {
    0% { width: 30%; left: -30%; }
    50% { width: 70%; }
    100% { width: 30%; left: 100%; }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`, styleSheet.cssRules.length);

// Add media query for responsiveness
styleSheet.insertRule(`
  @media (max-width: 600px) {
    .auth-loader {
      width: 120px;
      height: 120px;
    }
    
    .auth-loading-title {
      font-size: 1.5rem;
    }
  }
`, styleSheet.cssRules.length);

export default ProtectedRoute;