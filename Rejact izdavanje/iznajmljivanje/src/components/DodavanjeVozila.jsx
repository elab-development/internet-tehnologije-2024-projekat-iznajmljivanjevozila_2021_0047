import { useState } from "react";
import axios from "axios";

const DodavanjeVozila = () => {
    const [naziv, setNaziv] = useState("");
    const [proizvodjac, setProizvodjac] = useState("");
    const [godina, setGodina] = useState("");
    const [cenaPoDanu, setCenaPoDanu] = useState("");
    const [tipVozila, setTipVozila] = useState("SUV");
    const [status, setStatus] = useState("dostupno");
    const [slika, setSlika] = useState(null);
    const [poruka, setPoruka] = useState(null);
    const [greska, setGreska] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!naziv || !proizvodjac || !godina || !cenaPoDanu) {
            setGreska("Molimo popunite sva obavezna polja.");
            return;
        }

        const formData = new FormData();
        formData.append("naziv", naziv);
        formData.append("proizvodjac", proizvodjac);
        formData.append("god_proizvodnje", godina);
        formData.append("cena_po_danu", cenaPoDanu);
        formData.append("tip_vozila", tipVozila);
        formData.append("status", status);
        if (slika) {
            formData.append("slika", slika);
        }

        setLoading(true);
        setGreska(null);
        setPoruka(null);
        console.log(formData);

        try {
            const token = sessionStorage.getItem("auth_token");

            const res = await axios.post("/api/vozilo/dodaj", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setPoruka(res.data.message);
            setNaziv("");
            setProizvodjac("");
            setGodina("");
            setCenaPoDanu("");
            setTipVozila("SUV");
            setStatus("dostupno");
            setSlika(null);
        } catch (error) {
            setGreska(
                error.response?.data?.message ||
                "Dodavanje vozila nije uspelo. Proverite unos."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Dodavanje vozila</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>
                    Naziv:
                    <input
                        type="text"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                        style={styles.input}
                    />
                </label>
                <label>
                    Proizvođač:
                    <input
                        type="text"
                        value={proizvodjac}
                        onChange={(e) => setProizvodjac(e.target.value)}
                        style={styles.input}
                    />
                </label>
                <label>
                    Godina proizvodnje:
                    <input
                        type="number"
                        value={godina}
                        onChange={(e) => setGodina(e.target.value)}
                        style={styles.input}
                    />
                </label>
                <label>
                    Cena po danu (EURO):
                    <input
                        type="number"
                        value={cenaPoDanu}
                        onChange={(e) => setCenaPoDanu(e.target.value)}
                        step="0.01"
                        style={styles.input}
                    />
                </label>
                <label>
                    Tip vozila:
                    <select
                        value={tipVozila}
                        onChange={(e) => setTipVozila(e.target.value)}
                        style={styles.input}
                    >
                        <option value="SUV">SUV</option>
                        <option value="sedan">sedan</option>
                        <option value="kombi">kombi</option>
                        <option value="hatchback">hatchback</option>
                    </select>
                </label>
                <label>
                    Status:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={styles.input}
                    >
                        <option value="dostupno">dostupno</option>
                        <option value="u servisu">u servisu</option>
                    </select>
                </label>
                <label>
                    Slika (opcionalno):
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSlika(e.target.files[0])}
                        style={styles.input}
                    />
                </label>

                {greska && <p style={styles.error}>{greska}</p>}
                {poruka && <p style={styles.success}>{poruka}</p>}

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Dodavanje..." : "Dodaj vozilo"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
        backgroundColor: "#f0f8ff",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,255,0.2)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginTop: "5px",
        marginBottom: "15px",
        padding: "8px 10px",
        borderRadius: "5px",
        border: "1px solid #bbb",
        fontSize: "16px",
        outlineColor: "#1e90ff",
    },
    button: {
        backgroundColor: "#1e90ff",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    error: {
        color: "crimson",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    success: {
        color: "green",
        fontWeight: "bold",
        marginBottom: "10px",
    },
};

export default DodavanjeVozila;