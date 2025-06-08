import React from 'react'
import axios from 'axios';
import VoziloCard from './VoziloCard';
import { useEffect, useState } from 'react';


const PocetnaStranica = () => {
    const [vozila, setVozila] = useState([]);

    useEffect(() => {
        axios.get('api/vozilo')
            .then(response => {
                setVozila(response.data);
            })
            .catch(error => {
                console.error('Greška pri učitavanju vozila:', error);
            });
    }, []);
    return (

        <div>
            <div className="header-image-container">
                <img src="/pocetna.png" alt="Pregled svih vozila" className="header-image" />
                <h1 className="header-text">Pregled svih vozila</h1>
            </div>

            <div className="pocetna-grid">

                {vozila.map(vozilo => (
                    <VoziloCard key={vozilo.id} vozilo={vozilo} />
                ))}
            </div>
        </div>
    )
}

export default PocetnaStranica
