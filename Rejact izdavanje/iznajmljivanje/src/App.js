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
import IzmenaRezervacije from './components/IzmenaRezervacije';
import StatistikaPregled from './components/StatistikaPregled';
import CustomBreadcrumbs from './components/CustomBreadcrumbs';





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
      <div style={{ paddingTop: '70px' }}>  {/* isto kao height NavBar-a */}
        <CustomBreadcrumbs />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pocetna" element={<PocetnaStranica />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin/korisnici" element={<PrikazKorisnika />} />
          <Route path="/admin/dodajVozilo" element={<DodavanjeVozila />} />
          <Route path="/rezervacija/:id_vozila" element={<RezervacijaVozila />} />
          <Route path="/profil" element={<MojProfil />} />
          <Route path="/rezervacija/izmena/:id" element={<IzmenaRezervacije />} />
          <Route path="/admin/statistika" element={<StatistikaPregled />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
