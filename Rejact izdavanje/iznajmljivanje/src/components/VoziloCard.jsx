import React from 'react'
import '../App.css';


const VoziloCard = ({ vozilo }) => {
    const slikaUrl = vozilo.slika
        ? `http://127.0.0.1:8000/storage/${vozilo.slika}`
        : '/default-auto.jpg'; // default slika ako nema
    console.log(vozilo.slika);
    return (
        <div className="vozilo-card">
            <img src={slikaUrl} alt={vozilo.naziv} />
            <h2 className="text-xl font-bold">{vozilo.naziv}</h2>
            <p>Proizvođač: {vozilo.proizvodjac}</p>
            <p>Godina: {vozilo.god_proizvodnje}</p>
            <p>Cena po danu: {vozilo.cena_po_danu}€</p>
            <p>Status: {vozilo.status}</p>
        </div>
    );
};

export default VoziloCard
