import logo from './logo.svg';
import React from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import PocetnaStranica from './components/PocetnaStranica';
import Home from './components/Home';
import PrikazKorisnika from './components/PrikazKorisnika';
import DodavanjeVozila from './components/DodavanjeVozila';
import RezervacijaVozila from './components/RezervacijaVozila';
import MojProfil from './components/MojProfil';





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
        <Route path="/" element={<Home />} />
        <Route path="/admin/korisnici" element={<PrikazKorisnika />} />
        <Route path="/admin/dodajVozilo" element={<DodavanjeVozila />} />
        <Route path="/rezervacija/:id_vozila" element={<RezervacijaVozila />} />
        <Route path="/profil" element={<MojProfil />} />

      </Routes>
    </Router>
  );
}

export default App;
