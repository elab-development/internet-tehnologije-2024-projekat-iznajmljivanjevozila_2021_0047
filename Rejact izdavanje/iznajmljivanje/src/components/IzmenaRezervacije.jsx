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
        <div style={{ padding: '20px', maxWidth: '400px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h2>Izmeni rezervaciju</h2>
            {greska && <p style={{ color: 'red' }}>{greska}</p>}
            {uspeh && <p style={{ color: 'green' }}>{uspeh}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Datum početka: <small style={{ color: '#555' }}>({datumPocetka || 'nije postavljeno'})</small>
                    </label><br />
                    <input
                        type="date"
                        value={datumPocetka}
                        onChange={e => setDatumPocetka(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div>
                    <label>
                        Datum završetka: <small style={{ color: '#555' }}>({datumZavrsetka || 'nije postavljeno'})</small>
                    </label><br />
                    <input
                        type="date"
                        value={datumZavrsetka}
                        onChange={e => setDatumZavrsetka(e.target.value)}
                        required
                        min={datumPocetka || new Date().toISOString().split('T')[0]}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                    {loading ? 'Čekajte...' : 'Sačuvaj izmene'}
                </button>
            </form>
            <button
                onClick={() => navigate('/profil')}
                style={{ marginTop: '10px' }}
            >
                Zatvori
            </button>
        </div>
    );
};

export default IzmenaRezervacije;