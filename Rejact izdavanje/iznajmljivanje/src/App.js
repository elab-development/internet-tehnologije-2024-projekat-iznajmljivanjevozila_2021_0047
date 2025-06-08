import logo from './logo.svg';
import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import PocetnaStranica from './components/PrikazVozilaStranica';


function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/register" element={<RegisterPage />} />
    //     {/* možeš dodati i početnu stranicu */}
    //     <Route path="/pocetna" element={<PocetnaStranica />} />

    //   </Routes>
    // </Router>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pocetna" element={<PocetnaStranica />} />
      </Routes>
    </Router>
  );
}

export default App;
