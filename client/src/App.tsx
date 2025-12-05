import { Route, Routes } from 'react-router';
import Nav from './components/UI/Nav.jsx';
import Register from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Panel from './pages/Panel.jsx';
import Protect from './components/utils/Protect.jsx';
import Catalog from './pages/Catalog.jsx';
import Home from './pages/Home.jsx';
import LaptopDetail from './pages/LaptopDetail.jsx';

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
