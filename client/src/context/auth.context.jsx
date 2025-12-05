import { useContext, useEffect, useState, createContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export const authContext = createContext();

export const useAuth = () => useContext(authContext);

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/auto-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await res.json();
        if (res.ok) {
          setUser(result);
        }
      } catch (err) {
        console.error('Auto-login failed:', err);
      }
    };
    autoLogin();
  }, []);

  const register = async (formData) => {
    const toastId = toast.loading('Creating account...');
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.update(toastId, {
        render: result.message || 'Registration successful',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      navigate('/login');
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Registration failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  
  const login = async (formData) => {
    const toastId = toast.loading('Logging in...');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setUser(result);

      toast.update(toastId, {
        render: result.message || 'Login successful',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      navigate('/');
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Login failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const logout = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setUser(null);

      toast.update(toastId, {
        render: result.message || 'Logout successful',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      navigate('/');
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Logout failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const googleAuth = () =>{
    window.location.href = `${API_URL}/oauth/google`;
  }

  return (
    <authContext.Provider value={{ user, register, login, logout, googleAuth }}>
      {children}
    </authContext.Provider>
  );
};
