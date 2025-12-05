// @ts-nocheck
import { Navigate } from 'react-router';
import { useAuth } from '../../context/auth.context';

const Protect = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default Protect;
