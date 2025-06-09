import { useEffect, useState } from "react";
import axios from "axios";

const PrikazKorisnika = () => {
    const [korisnici, setKorisnici] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");

        axios.get("/api/users", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then((response) => {
                if (response.data.status === "success") {
                    setKorisnici(response.data.data);
                } else {
                    setError(response.data.message || "Došlo je do greške.");
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    setError("Nemate pristup ovoj stranici.");
                } else {
                    setError("Greška pri učitavanju korisnika.");
                }
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ padding: "20px" }}>Učitavanje...</p>;
    if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Pregled korisnika</h2>
            {korisnici.length === 0 ? (
                <p>Nema registrovanih korisnika.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Ime</th>
                            <th style={styles.th}>Prezime</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Tip korisnika</th>
                        </tr>
                    </thead>
                    <tbody>
                        {korisnici.map((korisnik, index) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>{korisnik.ime}</td>
                                <td style={styles.td}>{korisnik.prezime}</td>
                                <td style={styles.td}>{korisnik.email}</td>
                                <td style={styles.td}>{korisnik.tip_korisnika}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "30px",
        backgroundColor: "#e0f2ff", // svetloplava pozadina
        minHeight: "100vh",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#0b5394",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
    },
    th: {
        backgroundColor: "#cfe9ff",
        color: "#003366",
        padding: "12px",
        textAlign: "left",
        fontWeight: "bold",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
    },
    tr: {
        transition: "background-color 0.3s ease",
    },
    trHover: {
        backgroundColor: "#f0f8ff",
    },
};

export default PrikazKorisnika;