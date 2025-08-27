import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    // NOVO: stanje za statistiku po vozilu (graf)
    const [statistikaPoVozilu, setStatistikaPoVozilu] = useState([]);
    const [loadingPoVozilu, setLoadingPoVozilu] = useState(true);
    const [greskaPoVozilu, setGreskaPoVozilu] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        axios.get('/api/vozilo', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setVozila(res.data.data);
            })
            .catch(err => console.error('Greška pri učitavanju vozila:', err));
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');

        // Učitavanje ukupne statistike
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
                setStatistika(data);
                setLoadingUk(false);
            })
            .catch(err => {
                setGreskaUk(err.message);
                setLoadingUk(false);
            });

        // NOVO: Učitavanje statistike po vozilu (broj rezervacija)
        fetch('http://localhost:8000/api/statistika/po-vozilu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Greška u učitavanju statistike po vozilu');
                return res.json();
            })
            .then(data => {
                setStatistikaPoVozilu(data);
                setLoadingPoVozilu(false);
            })
            .catch(err => {
                setGreskaPoVozilu(err.message);
                setLoadingPoVozilu(false);
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
        } catch (err) {
            if (err.response?.data?.errors) {
                setGreska('Greška u unosu podataka. Datum mora biti u prošlosti.');
            } else {
                setGreska('Statistika trenutno nije dostupna.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loadingUk || loadingPoVozilu) return <p>Učitavanje statistike...</p>;
    if (greskaUk) return <p style={{ color: 'red' }}>{greskaUk}</p>;
    if (greskaPoVozilu) return <p style={{ color: 'red' }}>{greskaPoVozilu}</p>;
    if (!statistika) return null;

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
                        <strong>Ukupni prihod:</strong> {statistika.ukupni_prihod} EURA
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Broj otkazanih rezervacija (buduće):</strong> {statistika.broj_otkazanih}
                    </li>
                    <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <strong>Broj budućih rezervacija:</strong> {statistika.broj_buducih}
                    </li>
                    <li style={{ padding: '10px 0' }}>
                        <strong>Očekivani prihod:</strong> {statistika.ocekivan_prihod} EURA
                    </li>
                </ul>
            </div>

            {/* NOVO: Grafikon rezervacija po vozilu */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Broj rezervacija po vozilu</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statistikaPoVozilu} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="naziv" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="broj_rezervacija" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Forma za pregled statistike pojedinačnih vozila */}
            <div style={{
                backgroundColor: '#f8f8f8',
                padding: '20px',
                borderRadius: '10px'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Pregled statistike pojedinačnih vozila</h2>
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
                        <p><strong>Ukupna zarada:</strong> {rezultat.ukupna_zarada} EURA</p>
                        <p><strong>Prosečan broj dana:</strong> {rezultat.prosecan_broj_dana}</p>

                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ marginBottom: '10px' }}>Vizualizacija statistike</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        { naziv: 'Broj iznajmljivanja', vrednost: rezultat.broj_iznajmljivanja },
                                        { naziv: 'Ukupna zarada', vrednost: rezultat.ukupna_zarada },
                                        { naziv: 'Prosečan broj dana', vrednost: rezultat.prosecan_broj_dana },
                                    ]}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="naziv" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="vrednost" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatistikaPregled;
