import React, { useEffect, useState } from 'react';

function WeatherBG() {
    const [weatherText, setWeatherText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://wttr.in/Belgrade?format=j1");
                const data = await res.json();
                const current = data.current_condition[0];
                const summary = `
Temperatura: ${current.temp_C}°C
Vlažnost: ${current.humidity}%
Vetar: ${current.windspeedKmph} km/h
Stanje: ${current.weatherDesc[0].value}
                `;
                setWeatherText(summary.trim());
                setError(null);
            } catch {
                setError("Ne mogu da dohvatim podatke o vremenu.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <p style={styles.weatherLoading}>Učitavanje vremenske prognoze...</p>;
    if (error) return <p style={styles.weatherError}>{error}</p>;

    return (
        <div style={styles.weatherCard}>
            <h3 style={styles.weatherTitle}>Trenutno vreme u Beogradu</h3>
            <pre style={styles.weatherBox}>{weatherText}</pre>
        </div>
    );
}

function Home() {
    return (
        <div style={styles.container}>

            {/* Sekcija sa slikom i naslovom */}
            <div style={styles.heroContainer}>
                <img src='/beograd.jpg' alt="Vozilo na dan" style={styles.heroImage} />
                <h1 style={styles.heroTitle}>O nama</h1>
            </div>

            {/* Vremenska prognoza */}
            <WeatherBG />

            {/* Tekst o nama */}
            <p style={styles.text}>
                Dobrodošli na VoziloNaDan, vaš pouzdani partner za iznajmljivanje vozila! Naša misija je da vam omogućimo jednostavan i brz pristup kvalitetnim vozilima za sve vaše potrebe – bilo da vam treba auto za posao, putovanje ili slobodno vreme.
            </p>

            <p style={styles.text}>
                Sa velikim izborom vozila različitih kategorija, trudimo se da zadovoljimo i najzahtevnije korisnike. Naša platforma je intuitivna i sigurna, a podrška dostupna 24/7 kako bismo vam pružili najbolju uslugu.
            </p>

            <p style={styles.text}>
                Verujemo da iznajmljivanje vozila treba da bude lako, pristupačno i bez stresa. Zato smo tu da vam pomognemo da nađete savršeni auto brzo i po povoljnoj ceni, sa transparentnim uslovima i bez skrivenih troškova.
            </p>

            <p style={styles.text}>
                Hvala što ste odabrali VoziloNaDan. Vaša sigurnost i zadovoljstvo su nam na prvom mestu!
            </p>

            {/* Uslovi iznajmljivanja */}
            <h1 style={{ ...styles.title, marginTop: '60px' }}>Opšti uslovi iznajmljivanja vozila</h1>
            <hr style={styles.hr} />

            <div style={styles.textBlock}>
                <p>Vozač mora imati minimum 21 godinu</p>
                <p>Minimum 2 godine posedovanja vozačke dozvole i obavezno na uvid</p>
                <p>Obavezna identifikacija - lična karta ili pasoš na uvid</p>
                <p>Obavezna kreditna kartica kao sredstvo depozita plaćanja ili gotovinski depozit od 300 do 1800 EUR u zavisnosti od klase vozila</p>

                <h3>Dužina najma</h3>
                <p>Minimalna dužina najma je 1 dan (24 časa)...</p>

                <h3>Plaćanje i depozit</h3>
                <p>Najam se plaća prilikom preuzimanja...</p>

                <h3>Preuzimanje i vraćanje vozila</h3>
                <p>Vozilo se može preuzeti i vratiti u našoj poslovnici...</p>

                <h2>Rezervišite brzo i lako rent a car vozilo</h2>
                <p>Nije potrebna kreditna kartica</p>
                <p>Preuzmite vozilo na aerodromu ili bilo kom drugom mestu u Beogradu</p>
            </div>

            <hr style={styles.hr} />

            {/* Ikone sekcija */}
            <div style={styles.iconsRow}>
                {/* 3 ikone sa tekstom */}
                <div style={styles.iconBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.icon}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                    </svg>
                    <p>Minimalno 1 dan najma</p>
                    <p>...zakašnjenja kod vraćanja vozila...</p>
                </div>

                <div style={styles.iconBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.icon}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Kreditna kartica ili depozit</p>
                    <p>...Depozit se polaće putem kreditne kartice...</p>
                </div>

                <div style={styles.iconBox}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={styles.icon}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18" />
                    </svg>
                    <p>Preuzimanje širom Beograda</p>
                    <p>...dostava ili vraćanje vozila uz doplatu...</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    heroContainer: {
        position: 'relative',
        width: '100%',
        height: '66vh',
        marginBottom: '40px',
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    heroTitle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#ffffff',
        fontSize: '4rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 10px rgba(0,0,0,0.6)',
        zIndex: 2,
    },
    container: {
        maxWidth: '100%',
        margin: '40px auto',
        padding: '0 20px 40px',
        backgroundColor: '#e0f2fe',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: '#1e3a8a',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        fontSize: '3rem',
        fontWeight: '700',
        marginBottom: '20px',
    },
    text: {
        fontSize: '1.25rem',
        lineHeight: '1.8',
        marginBottom: '20px',
    },
    hr: {
        border: 'none',
        borderTop: '2px solid #2563eb',
        margin: '30px 0',
    },
    textBlock: {
        fontSize: '1.1rem',
        lineHeight: 1.7,
        textAlign: 'left',
        maxWidth: '700px',
        margin: 'auto',
    },
    iconsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 40,
        gap: 20,
    },
    iconBox: {
        flex: 1,
        minWidth: 120,
        textAlign: 'center',
        maxWidth: 300,
    },
    icon: {
        width: 48,
        height: 48,
        color: '#2563eb',
        marginBottom: 12,
    },
    weatherCard: {
        backgroundColor: '#e0f7fa',
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '320px',
        margin: '20px auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        color: '#0077b6',
        fontSize: '1.1rem',
        textAlign: 'left',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    weatherTitle: {
        marginBottom: '10px',
        fontSize: '1.5rem',
        color: '#023e8a',
    },
    weatherBox: {
        whiteSpace: "pre-wrap",
        margin: 0,
        padding: 0,
        border: 'none',
        backgroundColor: 'transparent',
        color: '#0077b6',
        fontSize: '1.2rem',
        lineHeight: '1.4',
        fontWeight: '500',
    },
    weatherLoading: {
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: '20px',
        color: '#0077b6',
    },
    weatherError: {
        color: 'red',
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default Home;
