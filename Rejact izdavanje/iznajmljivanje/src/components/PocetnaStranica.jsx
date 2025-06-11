import { useState, useEffect, useRef } from "react";
import axios from "axios";
import VoziloCard from "./VoziloCard"; // pretpostavljam da je tako

const PocetnaStranica = () => {
    const [vozila, setVozila] = useState([]);
    const [filters, setFilters] = useState({
        naziv: "",
        god_proizvodnje: "",
        cena_po_danu: ""
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tipKorisnika, setTipKorisnika] = useState(null);
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const debounceTimeout = useRef(null);
    const fetchVozila = (page = 1, activeFilters) => {
        setLoading(true);
        setErrorMessage("");

        const params = {
            page,
            ...activeFilters,
        };

        axios.get("/api/vozilo", { params })
            .then(res => {
                if (res.data.data.length === 0) {
                    setErrorMessage("Nema vozila po zadatom kriterijumu.");
                    setVozila([]); // nema vozila za prikaz
                    setPagination({ current_page: 1, last_page: 1 });
                } else {
                    setErrorMessage(""); // obriši poruku o grešci ako postoji
                    setVozila(res.data.data);
                    setPagination({
                        current_page: res.data.current_page,
                        last_page: res.data.last_page,
                    });
                }
            })
            .catch(err => {
                console.error("Greška pri učitavanju vozila:", err);
                setErrorMessage("Došlo je do greške pri učitavanju podataka.");
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // Učitaj tip korisnika (tvoj postojeći kod)
    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
            setTipKorisnika(null);
            return;
        }

        axios.get("/api/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setTipKorisnika(res.data.tip_korisnika))
            .catch(err => console.error("Greška pri dohvaćanju korisnika", err));
    }, []);

    // Učitaj vozila na prvu i kad se filteri ili stranica promene
    useEffect(() => {
        fetchVozila(pagination.current_page, debouncedFilters);
    }, [debouncedFilters, pagination.current_page]);


    // Handle input promene filtera
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setDebouncedFilters(prev => ({
                ...prev,
                [name]: value,
            }));
        }, 500);
        // Resetuj stranicu na 1 kad menjamo filter
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    // Navigacija paginacije
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
        }
    };

    return (
        <div>
            <div className="header-image-container">
                <img src="/pocetna.png" alt="Pregled svih vozila" className="header-image" />
                <h1 className="header-text">Pregled svih vozila</h1>
            </div>

            {/* Filter forma */}
            <div className="filter-container">
                <input
                    type="text"
                    name="naziv"
                    placeholder="Pretraga po nazivu"
                    value={filters.naziv}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="god_proizvodnje"
                    placeholder="Godina proizvodnje"
                    value={filters.god_proizvodnje}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="cena_po_danu"
                    placeholder="Maksimalna cena po danu"
                    value={filters.cena_po_danu}
                    onChange={handleFilterChange}
                />
            </div>

            {/* Prikaz poruke ako nema rezultata ili učitavanje */}
            {loading && <p>Učitavanje vozila...</p>}
            {errorMessage && !loading && <p>{errorMessage}</p>}

            {/* Prikaz vozila */}
            {vozila.length > 0 ? (
                <div className="pocetna-grid">
                    {vozila.map(vozilo => (
                        <VoziloCard
                            key={vozilo.id_vozila}
                            vozilo={vozilo}
                            tipKorisnika={tipKorisnika}
                            onVoziloObrisano={(id) => setVozila(prev => prev.filter(v => v.id_vozila !== id))}
                            onVoziloIzmenjeno={(izmenjenoVozilo) =>
                                setVozila(prev =>
                                    prev.map(v =>
                                        v.id_vozila === izmenjenoVozilo.id_vozila ? izmenjenoVozilo : v
                                    )
                                )
                            }
                        />
                    ))}
                </div>
            ) : null}

            {/* Pagination Controls */}
            {vozila.length > 0 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                    >
                        Prethodna
                    </button>
                    <span>Strana {pagination.current_page} od {pagination.last_page}</span>
                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                    >
                        Sledeća
                    </button>
                </div>
            )}
        </div>
    );
};

export default PocetnaStranica;

