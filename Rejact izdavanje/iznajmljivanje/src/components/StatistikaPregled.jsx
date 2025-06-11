import { useState, useEffect } from 'react';
import axios from 'axios';

const StatistikaPregled = () => {
    const [vozila, setVozila] = useState([]);
    const [idVozila, setIdVozila] = useState('');
    const [datumPocetka, setDatumPocetka] = useState('');
    const [datumKraja, setDatumKraja] = useState('');
    const [rezultat, setRezultat] = useState(null);
    const [greska, setGreska] = useState('');
    const [loading, setLoading] = useState(false);
    const [statistika, setStatistika] = useState(null);
    const [loadingUk, setLoadingUk] = useState(true);
    const [greskaUk, setGreskaUk] = useState(null);



    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        axios.get('/api/vozilo', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log('Podaci sa servera:', res.data);
                setVozila(res.data.data);  // <--- ispravljeno ovde
            })
            .catch(err => console.error('Greška pri učitavanju vozila:', err));
    }, []);
    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        console.log('Token za statistiku:', token);

        fetch('http://localhost:8000/api/statistikaUkupna', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Greška u učitavanju statistike');
                return res.json();
            })
            .then(data => {
                console.log('Primljeni podaci:', data);
                setStatistika(data);
                setLoadingUk(false);
            })
            .catch(err => {
                console.error('Greška pri fetch-u statistike:', err);
                setGreskaUk(err.message);
                setLoadingUk(false);
            });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGreska('');
        setRezultat(null);
        setLoading(true);

        try {
            const token = sessionStorage.getItem('auth_token');
            const response = await axios.post('/api/statistika', {
                id_vozila: idVozila,
                datum_pocetka: datumPocetka,
                datum_kraja: datumKraja
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRezultat(response.data);
            console.log(response.data);
        } catch (err) {
            if (err.response?.data?.errors) {
                setGreska('Greška u unosu podataka.');
            } else {
                setGreska('Statistika trenutno nije dostupna.');
            }
        } finally {
            setLoading(false);
        }
    };
    if (loadingUk) return <p>Učitavanje statistike...</p>;
    if (greskaUk) return <p style={{ color: 'red' }}>{greskaUk}</p>;
    if (!statistika) return null
    return (
        <div style={{
            maxWidth: '600px',
            margin: '30px auto',
            padding: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#333',
            lineHeight: '1.6'
        }}>
            {/* Ukupna statistika */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Ukupna statistika</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Izvršenih rezervacija:</strong> {statistika.ukupno_izvrsenih}
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Otkazanih rezervacija (do sada):</strong> {statistika.ukupno_otkazanih}
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Ukupni prihod:</strong> {statistika.ukupni_prihod} RSD
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Broj otkazanih rezervacija (buduće):</strong> {statistika.broj_otkazanih}
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Broj budućih rezervacija:</strong> {statistika.broj_buducih}
                    </li>
                    <li style={{ padding: '10px 0' }}>
                        <strong>Očekivani prihod:</strong> {statistika.ocekivan_prihod} RSD
                    </li>
                </ul>
            </div>

            {/* Forma za pregled statistike */}
            <div style={{
                backgroundColor: '#f8f8f8',
                padding: '20px',
                borderRadius: '10px'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Pregled statistike pojedincanih vozila</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Vozilo:</label>
                        <select
                            value={idVozila}
                            onChange={(e) => setIdVozila(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Izaberite vozilo --</option>
                            {vozila.map((vozilo) => (
                                <option key={vozilo.id_vozila} value={vozilo.id_vozila}>
                                    {vozilo.naziv} ({vozilo.proizvodjac})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Datum početka:</label>
                        <input
                            type="date"
                            value={datumPocetka}
                            onChange={(e) => setDatumPocetka(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Datum kraja:</label>
                        <input
                            type="date"
                            value={datumKraja}
                            onChange={(e) => setDatumKraja(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: loading ? '#ccc' : '#3498db',
                            color: '#fff',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                    >
                        Prikaži statistiku
                    </button>
                </form>

                {loading && <p style={{ marginTop: '15px' }}>Učitavanje...</p>}
                {greska && <p style={{ marginTop: '15px', color: 'red' }}>{greska}</p>}

                {rezultat && (
                    <div style={{ marginTop: '20px' }}>
                        <h3 style={{ marginBottom: '10px' }}>Rezultati:</h3>
                        <p><strong>Broj iznajmljivanja:</strong> {rezultat.broj_iznajmljivanja}</p>
                        <p><strong>Ukupna zarada:</strong> {rezultat.ukupna_zarada} RSD</p>
                        <p><strong>Prosečan broj dana:</strong> {rezultat.prosecan_broj_dana}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatistikaPregled;
