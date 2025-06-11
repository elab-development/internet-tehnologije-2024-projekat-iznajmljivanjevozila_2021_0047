import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MojProfil = () => {
    const [rezervacije, setRezervacije] = useState([]);
    const [error, setError] = useState('');
    const [korisnik, setKorisnik] = useState(null);
    const [loading, setLoading] = useState(true);
    const [greska, setGreska] = useState(null);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [naziv, setNaziv] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [imaDokument, setImaDokument] = useState(false);
    useEffect(() => {
        const proveriDokument = async () => {
            try {
                const token = sessionStorage.getItem('auth_token');
                const res = await axios.get('/api/dokument/postoji', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setImaDokument(res.data.ima_dokument);
                console.log(res.data.ima_dokument)
            } catch (err) {
                console.error('Greška pri proveri dokumenta', err);
            }
        };

        proveriDokument();
    }, []);
    useEffect(() => {
        const token = sessionStorage.getItem('auth_token');
        axios.get('/api/rezervacijaSve', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                console.log("Odgovor sa servera:", res.data);
                setRezervacije(res.data.rezervacije); // ← BITNO

            })
            .catch(() => setError(''));
    }, []);
    useEffect(() => {
        const fetchKorisnik = async () => {
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
                    }
                });
                setKorisnik(response.data);
            } catch (error) {
                setGreska('Greška pri učitavanju korisnika.');
            } finally {
                setLoading(false);
            }
        };

        fetchKorisnik(); // pozivanje funkcije
    }, []);
    const handleCancel = async (idRezervacije) => {
        if (!window.confirm('Da li ste sigurni da želite da otkažete ovu rezervaciju?')) return;

        try {
            const response = await axios.put(
                `/api/rezervacijaOtkazivanje/${idRezervacije}`,
                {}, // POST body može biti prazan ako nije potreban
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
                    }
                }
            );

            alert(response.data.message);

            // Nakon uspešnog otkazivanja osveži listu rezervacija u stanju
            // setRezervacije((prevRezervacije) =>
            //     prevRezervacije.filter((r) => r.id_rezervacija !== idRezervacije)
            //);

        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('Greška pri otkazivanju rezervacije.');
            }
        }
    };
    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadMessage("");
        setUploadError("");

        if (!file || !naziv.trim()) {
            setUploadError("Molimo popunite naziv i izaberite fajl.");
            return;
        }

        const formData = new FormData();
        formData.append("document", file);
        formData.append("naziv", naziv.trim());

        try {
            const token = sessionStorage.getItem("auth_token");
            const res = await axios.post("/api/upload-document", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            setUploadMessage(res.data.message);
            setNaziv("");
            setFile(null);
        } catch (error) {
            if (error.response?.data?.message) {
                setUploadError(error.response.data.message);
            } else {
                setUploadError("Greška prilikom uploada dokumenta.");
            }
        }
    };
    return (

        <div style={{ maxWidth: '1200px', margin: '40px auto' }}>
            <div style={{
                display: 'flex',
                gap: '30px',
                marginBottom: '30px',
                alignItems: 'flex-start',
            }}>
                {/* LEVA STRANA – Moji podaci */}
                <div style={{
                    flex: 1,
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: '#f2f2f2',
                }}>
                    {loading ? (
                        <p>Učitavanje korisničkih podataka...</p>
                    ) : greska ? (
                        <p style={{ color: 'red' }}>{greska}</p>
                    ) : korisnik ? (
                        <>
                            <h2>Moji podaci</h2>
                            <p><strong>Ime:</strong> {korisnik.ime}</p>
                            <p><strong>Prezime:</strong> {korisnik.prezime}</p>
                            <p><strong>Email:</strong> {korisnik.email}</p>
                        </>
                    ) : (
                        <p>Nema podataka o korisniku.</p>
                    )}
                </div>

                {/* DESNA STRANA – Upload dokumenta */}
                <div style={{
                    flex: 1,
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: '#fafafa'
                }}>
                    <h2>Dodaj dokument</h2>
                    {imaDokument ? (
                        <p style={{ color: 'green' }}>Već ste dodali dokument.</p>
                    ) : (
                        <p style={{ color: 'red' }}>
                            Ukoliko unesete dokument, možete da izbegnete doplatu od 100 dinara zbog administrativnih poslova prilikom preuzimanja vozila.
                        </p>
                    )}
                    {uploadMessage && <p style={{ color: 'green' }}>{uploadMessage}</p>}
                    {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Naziv dokumenta:</label><br />
                            <input
                                type="text"
                                value={naziv}
                                onChange={(e) => setNaziv(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label>Izaberite fajl (PDF, JPG, PNG):</label><br />
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Pošalji dokument
                        </button>
                    </form>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>
                    Učitavam rezervacije...
                </p>
            ) : (
                <>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <h2>Moje rezervacije</h2>
                    {Array.isArray(rezervacije) && rezervacije.length > 0 ? (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '20px',
                            }}
                        >
                            {rezervacije.map((rez) => (
                                <div
                                    key={rez.id_rezervacija}
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <img
                                        src={
                                            rez.vozilo?.slika
                                                ? `http://127.0.0.1:8000/storage/${rez.vozilo.slika}`
                                                : 'default-auto.jpg'
                                        }
                                        alt={`${rez.vozilo?.naziv} slika`}
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
                                    />
                                    <p>
                                        <strong>Vozilo:</strong> {rez.vozilo?.naziv} ({rez.vozilo?.proizvodjac},{' '}
                                        {rez.vozilo?.tip_vozila})
                                    </p>
                                    <p>
                                        <strong>Datum početka:</strong> {rez.Datum_pocetka}
                                    </p>
                                    <p>
                                        <strong>Datum završetka:</strong> {rez.Datum_zavrsetka}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {rez.Status_rezervacije}
                                    </p>
                                    <p>
                                        <strong>Cena ukupno:</strong> {rez.Cena_ukupno} RSD
                                    </p>
                                    {new Date(rez.Datum_pocetka) > new Date() && rez.Status_rezervacije === 'aktivno' && (
                                        <>
                                            <button onClick={() => handleCancel(rez.id_rezervacija)}>Otkaži rezervaciju</button>
                                            <button onClick={() => navigate(`/rezervacija/izmena/${rez.id_rezervacija}`)}>
                                                Izmeni rezervaciju
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nemate nijednu rezervaciju.</p>
                    )}
                </>
            )}

        </div>
    );
};


export default MojProfil;