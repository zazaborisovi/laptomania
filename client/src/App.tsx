import { Route, Routes } from 'react-router';
import Nav from './components/UI/Nav.tsx';
import Register from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Panel from './pages/Panel.tsx';
import Protect from './components/utils/Protect.tsx';
import Catalog from './pages/Catalog.tsx';
import Home from './pages/Home.tsx';
import LaptopDetail from './pages/LaptopDetail';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/laptops" element={<Catalog />} />
        <Route path="/laptops/:id" element={<LaptopDetail />} />
        <Route
          path="/panel"
          element={
            <Protect>
              <Panel />
            </Protect>
          }
        />
      </Routes>

      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}
