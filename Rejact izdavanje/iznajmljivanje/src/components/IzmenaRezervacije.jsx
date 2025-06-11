import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const IzmenaRezervacije = ({ onClose, onUpdateSuccess }) => {
    const [datumPocetka, setDatumPocetka] = useState('');
    const [datumZavrsetka, setDatumZavrsetka] = useState('');
    const [loading, setLoading] = useState(false);
    const [greska, setGreska] = useState(null);
    const [uspeh, setUspeh] = useState(null);
    const { id: rezervacijaId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        // Učitaj postojeće podatke rezervacije da popuniš formu
        const token = sessionStorage.getItem('auth_token');
        axios.get(`/api/rezervacijaJedna/${rezervacijaId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                console.log('Odgovor API-ja:', res.data);
                setDatumPocetka(res.data.Datum_pocetka);
                setDatumZavrsetka(res.data.Datum_zavrsetka);

            })
            .catch(() => setGreska('Neuspešno učitavanje podataka rezervacije.'));
    }, [rezervacijaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGreska(null);
        setUspeh(null);

        const token = sessionStorage.getItem('auth_token');

        try {
            const response = await axios.put(`/api/rezervacija/${rezervacijaId}`, {
                datum_pocetka: datumPocetka,
                datum_zavrsetka: datumZavrsetka,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUspeh(response.data.message);
            if (onUpdateSuccess) onUpdateSuccess(response.data.rezervacija);
        } catch (error) {
            if (error.response?.data?.message) {
                setGreska(error.response.data.message);
            } else {
                setGreska('Greška pri izmeni rezervacije.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                backgroundColor: '#eef2f7',
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '25px 30px',
                    borderRadius: '10px',
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    color: '#333',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
                    Izmeni rezervaciju
                </h2>

                {greska && (
                    <p
                        style={{
                            color: 'red',
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontWeight: '600',
                        }}
                    >
                        {greska}
                    </p>

                )}
                {uspeh && (
                    <p
                        style={{
                            color: 'green',
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontWeight: '600',
                        }}
                    >
                        {uspeh}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                            Datum početka: <small style={{ color: '#555' }}>({datumPocetka || 'nije postavljeno'})</small>
                        </label>
                        <input
                            type="date"
                            value={datumPocetka}
                            onChange={(e) => setDatumPocetka(e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                            Datum završetka: <small style={{ color: '#555' }}>({datumZavrsetka || 'nije postavljeno'})</small>
                        </label>
                        <input
                            type="date"
                            value={datumZavrsetka}
                            onChange={(e) => setDatumZavrsetka(e.target.value)}
                            required
                            min={datumPocetka || new Date().toISOString().split('T')[0]}
                            style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: loading ? '#95a5a6' : '#2980b9',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        {loading ? 'Čekajte...' : 'Sačuvaj izmene'}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/profil')}
                    style={{
                        marginTop: '15px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #2980b9',
                        backgroundColor: 'white',
                        color: '#2980b9',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2980b9';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#2980b9';
                    }}
                >
                    Zatvori
                </button>
            </div>
        </div>
    );
};

export default IzmenaRezervacije;