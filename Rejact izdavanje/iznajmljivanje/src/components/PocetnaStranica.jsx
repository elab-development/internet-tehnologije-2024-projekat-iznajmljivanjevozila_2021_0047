import React from 'react'
import axios from 'axios';
import VoziloCard from './VoziloCard';
import { useEffect, useState } from 'react';


const PocetnaStranica = () => {
    const [vozila, setVozila] = useState([]);
    const handleVoziloObrisano = (id) => {
        console.log("Brišem vozilo sa ID:", id);
        setVozila(prev => prev.filter(v => v.id_vozila !== id));
    };
    const handleVoziloIzmenjeno = (izmenjenoVozilo) => {
        setVozila(prevVozila =>
            prevVozila.map(v =>
                v.id_vozila === izmenjenoVozilo.id_vozila ? izmenjenoVozilo : v
            )
        );
    };
    useEffect(() => {
        axios.get('api/vozilo')
            .then(response => {
                setVozila(response.data);

            })
            .catch(error => {
                console.error('Greška pri učitavanju vozila:', error);
            });
    }, []);
    const [tipKorisnika, setTipKorisnika] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
            setTipKorisnika(null);
            return;
        }

        axios.get("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setTipKorisnika(res.data.tip_korisnika);

            })
            .catch(err => {
                console.error("Greška pri dohvaćanju korisnika", err);
            });
    }, []);
    useEffect(() => {
        console.log("Vozila:", vozila);
    }, [vozila]);
    return (

        <div>
            <div className="header-image-container">
                <img src="/pocetna.png" alt="Pregled svih vozila" className="header-image" />
                <h1 className="header-text">Pregled svih vozila</h1>
            </div>

            <div className="pocetna-grid">

                {vozila.map(vozilo => (

                    <VoziloCard key={vozilo.id_vozila} vozilo={vozilo} tipKorisnika={tipKorisnika} onVoziloObrisano={handleVoziloObrisano} onVoziloIzmenjeno={handleVoziloIzmenjeno} />

                ))}
            </div>

        </div>
    )
}

export default PocetnaStranica
