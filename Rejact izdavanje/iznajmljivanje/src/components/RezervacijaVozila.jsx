import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RezervacijaVozila = () => {
    const { id_vozila } = useParams();
    const navigate = useNavigate();

    const [vozilo, setVozilo] = useState(null);
    const [datumPocetka, setDatumPocetka] = useState('');
    const [datumZavrsetka, setDatumZavrsetka] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    useEffect(() => {
        if (!id_vozila) return;

        axios.get('/api/vozilo', {
            params: {
                id_vozila: id_vozila
            }
        })
            .then(res => {
                console.log('Dobijeno vozilo:', res.data);
                setVozilo(res.data[0]);

            })

            .catch(() => setError('Greška pri učitavanju vozila'));
    }, [id_vozila]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = sessionStorage.getItem('auth_token');

            const response = await axios.post('/api/rezervacija', {
                id_vozila,
                datum_pocetka: datumPocetka,
                datum_zavrsetka: datumZavrsetka,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/pocetna');
            }, 3000);
            // Opcionalno: posle uspešne rezervacije možeš redirectovati korisnika
            // navigate('/neka-stranica');

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Došlo je do greške prilikom rezervacije.');
            }
        }
    };
    console.log('Prikaz vozila:', vozilo);
    if (!vozilo) return <div>Učitavanje vozila...</div>;


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '900px',
            margin: '40px auto',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f9f9f9',
        }}>
            {/* Leva strana - Podaci o vozilu */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <img src={`http://localhost:8000/storage/${vozilo.slika}`} alt={vozilo.naziv} />

                <h2 className="text-xl font-bold">{vozilo.naziv}</h2>
                <p>Proizvođač: {vozilo.proizvodjac}</p>
                <p>Godina: {vozilo.god_proizvodnje}</p>
                <p>Cena po danu: {vozilo.cena_po_danu}€</p>
                <p>Status: {vozilo.status}</p>
            </div>

            {/* Desna strana - Forma za rezervaciju */}
            <div style={{
                flex: 1,
                paddingLeft: '20px',
                borderLeft: '2px solid #ddd'
            }}>
                <h2 style={{ marginBottom: '20px' }}>Rezerviši vozilo</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Datum početka:
                        </label>
                        <input
                            type="date"
                            value={datumPocetka}
                            onChange={e => setDatumPocetka(e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Datum završetka:
                        </label>
                        <input
                            type="date"
                            value={datumZavrsetka}
                            onChange={e => setDatumZavrsetka(e.target.value)}
                            required
                            min={datumPocetka || new Date().toISOString().split('T')[0]}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '12px 25px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        Potvrdi rezervaciju
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '15px' }}>{success}</p>}
            </div>
        </div >
    );
};
export default RezervacijaVozila;