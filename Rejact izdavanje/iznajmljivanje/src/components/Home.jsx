import React from 'react'

function Home() {
    return (
        <div>
            <div style={styles.container}>

                {/* Slika i o nama tekst */}
                <div style={styles.heroContainer}>
                    <img src='/beograd.jpg' alt="Vozilo na dan" style={styles.heroImage} />
                    <h1 style={styles.heroTitle}>O nama</h1>
                </div>
                <p style={styles.text}>
                    Dobrodošli na VoziloNaDan, vaš pouzdani partner za iznajmljivanje vozila!
                    Naša misija je da vam omogućimo jednostavan i brz pristup kvalitetnim vozilima
                    za sve vaše potrebe – bilo da vam treba auto za posao, putovanje ili slobodno vreme.
                </p>

                <p style={styles.text}>
                    Sa velikim izborom vozila različitih kategorija, trudimo se da zadovoljimo i najzahtevnije korisnike.
                    Naša platforma je intuitivna i sigurna, a podrška dostupna 24/7 kako bismo vam pružili najbolju uslugu.
                </p>

                <p style={styles.text}>
                    Verujemo da iznajmljivanje vozila treba da bude lako, pristupačno i bez stresa. Zato smo tu da vam
                    pomognemo da nađete savršeni auto brzo i po povoljnoj ceni, sa transparentnim uslovima i bez skrivenih troškova.
                </p>

                <p style={styles.text}>
                    Hvala što ste odabrali VoziloNaDani. Vaša sigurnost i zadovoljstvo su nam na prvom mestu!
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
                    <p>Minimalna dužina najma je 1 dan (24 časa). Vreme preuzimanja i vraćanja vozila mora biti identično. Tolerišemo samo 60 minuta zakašnjenja kod vraćanja vozila. Po isteku prekoračenja, zaračunavamo novi, dodatni dan najma.</p>

                    <h3>Plaćanje i depozit</h3>
                    <p>Najam se plaća prilikom preuzimanja rent a car vozila i to kreditnom karticom (Amex, Visa, Mastercard), gotovinom ili uplatom na račun (pravna lica). Depozit za vreme trajanja najma je obavezan. Depozit se polaće putem kreditne kartice ili gotovine. Depozit se određuje na osnovu klase vozila.</p>

                    <h3>Preuzimanje i vraćanje vozila</h3>
                    <p>Vozilo iz naše ponude Rent a car Beograd vozila se može preuzeti i vratiti u našoj poslovnici na Vračaru ili aerodromu Nikola Tesla, a moguća je i dostava odnosno vraćanje vozila na teritoriji grada kao i cele Srbije uz doplatu. Vozilo se može preuzeti i vratiti i izvan radnog vremena, uz doplatu. Prilikom preuzimanja i vraćanja vozila, obavezno je potpisivanje ugovora i izveštaja o stanju vozila. Insistiramo da sa našim službenikom dobro pregledate vozilo prilikom preuzimanja.</p>

                    <h2>Rezervišite brzo i lako rent a car vozilo</h2>
                    <p>Nije potrebna kreditna kartica</p>
                    <p>Preuzmite vozilo na aerodromu ili bilo kom drugom mestu u Beogradu</p>
                </div>

                <hr style={styles.hr} />

                {/* Ikone i tekst ispod */}
                <div style={styles.iconsRow}>
                    <div style={styles.iconBox}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={styles.icon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                        </svg>
                        <p>Minimalno 1 dan najma</p>
                        <p>Minimalna dužina najma je 1 dan (24 časa) Vreme preuzimanja i vraćanja vozila mora biti identično. Tolerišemo samo 60 minuta zakašnjenja kod vraćanja vozila. Po isteku prekoračenja, zaračunavamo novi, dodatni dan najma</p>
                    </div>

                    <div style={styles.iconBox}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={styles.icon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p>Kreditna kartica ili depozit</p>
                        <p>Najam se plaća prilikom preuzimanja rent a car vozila i to kreditnom karticom (Amex, Visa, Mastercard), gotovinom ili uplatom na račun (pravna lica) Depozit za vreme trajanja najma je obavezan. Depozit se polaće putem kreditne kartice ili gotovine Depozit se određuje na osnovu klase vozila</p>
                    </div>

                    <div style={styles.iconBox}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={styles.icon}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18" />
                        </svg>
                        <p>Preuzimanje širom Beograda</p>
                        <p>Vozilo iz naše ponude VoziloNaDan vozila se može preuzeti i vratiti u našoj poslovnici na Vračaru ili aerodromu Nikola Tesla, a moguća je i dostava odnosno vraćanje vozila na teritoriji grada kao i cele Srbije uz doplatu. Vozilo se može preuzeti i vratiti i izvan radnog vremena, uz doplatu Prilikom preuzimanja i vraćanja vozila, obavezno je potpisivanje ugovora i izveštaja o stanju vozila. Insistiramo da sa našim službenikom dobro pregledate vozilo prilikoom preuzimanja.</p>
                    </div>
                </div>
            </div>
        </div>
    )
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
    image: {
        width: '100%',
        maxHeight: '300px',
        objectFit: 'cover',
        borderRadius: '12px 12px 0 0',
        marginBottom: '30px',
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
        justifyContent: 'space-around',
        marginTop: 40,
        gap: 20,
    },
    iconBox: {
        flex: 1,
        minWidth: 120,
        textAlign: 'center',
    },
    icon: {
        width: 48,
        height: 48,
        color: '#2563eb',
        marginBottom: 12,
    },
};
export default Home
