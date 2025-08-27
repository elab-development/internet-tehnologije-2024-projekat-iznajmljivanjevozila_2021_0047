import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VoziloCard = ({ vozilo, tipKorisnika, onVoziloObrisano, onVoziloIzmenjeno, convert, currency }) => {
    const navigate = useNavigate();
    const slikaUrl = vozilo.slika
        ? `http://127.0.0.1:8000/storage/${vozilo.slika}`
        : '/default-auto.jpg'; // default slika ako nema

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        naziv: vozilo.naziv || '',
        proizvodjac: vozilo.proizvodjac || '',
        god_proizvodnje: vozilo.god_proizvodnje || '',
        cena_po_danu: vozilo.cena_po_danu || '',
        status: vozilo.status || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitIzmena = async () => {
        try {
            const token = sessionStorage.getItem("auth_token");

            const payload = {
                naziv: formData.naziv,
                proizvodjac: formData.proizvodjac,
                god_proizvodnje: formData.god_proizvodnje,
                cena_po_danu: formData.cena_po_danu,
                status: formData.status,
            };

            await axios.put(`/api/vozilo/${vozilo.id_vozila}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            onVoziloIzmenjeno({
                ...vozilo,
                ...payload,
            });

            setEditMode(false);
        } catch (err) {
            console.error('Greška pri izmeni vozila:', err);
        }
    };

    if (editMode) {
        return (
            <div className="vozilo-card" style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "15px" }}>
                <input
                    type="text"
                    name="naziv"
                    value={formData.naziv}
                    onChange={handleInputChange}
                    placeholder="Naziv vozila"
                    style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                />
                <input
                    type="text"
                    name="proizvodjac"
                    value={formData.proizvodjac}
                    onChange={handleInputChange}
                    placeholder="Proizvođač"
                    style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                />
                <input
                    type="number"
                    name="god_proizvodnje"
                    value={formData.god_proizvodnje}
                    onChange={handleInputChange}
                    placeholder="Godina proizvodnje"
                    style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                />
                <input
                    type="number"
                    name="cena_po_danu"
                    value={formData.cena_po_danu}
                    onChange={handleInputChange}
                    placeholder="Cena po danu (€)"
                    style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ marginBottom: "10px", width: "100%", padding: "8px" }}
                >
                    <option value="">-- Odaberi status --</option>
                    <option value="u servisu">U servisu</option>
                    <option value="dostupno">Dostupno</option>
                </select>

                <img src={slikaUrl} alt={formData.naziv} width={150} style={{ marginBottom: "10px", borderRadius: "8px" }} />

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={submitIzmena}
                        style={{ padding: "8px 14px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px" }}
                    >
                        Sačuvaj
                    </button>
                    <button
                        onClick={() => setEditMode(false)}
                        style={{ padding: "8px 14px", cursor: "pointer", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "8px" }}
                    >
                        Otkaži
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="vozilo-card">
            <img src={slikaUrl} alt={vozilo.naziv} />
            {slikaUrl.includes("default-auto.jpg") && (
                <div>Ovo je samo primer slike jer nemamo sliku ovog auta</div>
            )}
            <h2 className="text-xl font-bold">{vozilo.naziv}</h2>
            <p>Proizvođač: {vozilo.proizvodjac}</p>
            <p>Godina: {vozilo.god_proizvodnje}</p>
            <p>Cena po danu: {convert(vozilo.cena_po_danu)} {currency}</p> {/* Prikaz u valuti */}
            <p>Status: {vozilo.status}</p>
            {tipKorisnika && tipKorisnika !== "admin" && (
                <button
                    onClick={() => navigate(`/rezervacija/${vozilo.id_vozila}`)}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={e => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={e => (e.target.style.backgroundColor = '#007bff')}
                >
                    Rezerviši
                </button>
            )}
            {tipKorisnika === "admin" && (
                <div className="admin-dugmad" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setEditMode(true)}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={e => (e.target.style.backgroundColor = '#45a049')}
                        onMouseOut={e => (e.target.style.backgroundColor = '#4CAF50')}
                    >
                        Izmeni
                    </button>

                    <button
                        onClick={() => {
                            const token = sessionStorage.getItem("auth_token");

                            if (window.confirm("Da li ste sigurni da želite da obrišete ovo vozilo?")) {
                                axios.delete(`/api/voziloBrisanje/${vozilo.id_vozila}`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                })
                                    .then(() => {
                                        alert("Vozilo je obrisano.");
                                        onVoziloObrisano(vozilo.id_vozila);
                                    })
                                    .catch(err => {
                                        alert("Greška prilikom brisanja.");
                                        console.error(err);
                                    });
                            }
                        }}
                        style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={e => (e.target.style.backgroundColor = '#e53935')}
                        onMouseOut={e => (e.target.style.backgroundColor = '#f44336')}
                    >
                        Obriši
                    </button>
                </div>
            )}
        </div>
    );
};

export default VoziloCard;
