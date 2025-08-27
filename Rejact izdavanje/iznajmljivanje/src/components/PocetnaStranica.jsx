import { useState, useEffect, useRef } from "react";
import axios from "axios";
import VoziloCard from "./VoziloCard";
import { useCurrency } from "./Valute"; 

const PocetnaStranica = () => {
    // currency context
    const { currency, setCurrency, rates, convert, loading: loadingRates } = useCurrency();

    // stanje
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

    // funkcija za fetch vozila
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
                    setVozila([]);
                    setPagination({ current_page: 1, last_page: 1 });
                } else {
                    setErrorMessage("");
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
            .finally(() => setLoading(false));
    };

    // fetch korisnika i tip korisnika
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

    // fetch vozila na promenu filtera ili stranice
    useEffect(() => {
        fetchVozila(pagination.current_page, debouncedFilters);
    }, [debouncedFilters, pagination.current_page]);

    // debounce i update filtera
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
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

        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    // promena stranice
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

            {/* Dropdown za valutu */}
            <div style={{ margin: '15px 0' }}>
                <label htmlFor="currency-select">Izaberite valutu: </label>
                <select
                    id="currency-select"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    disabled={loadingRates}
                >
                    {Object.keys(rates).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
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

            {/* Poruke i učitavanje */}
            {loading && <p>Učitavanje vozila...</p>}
            {errorMessage && !loading && <p>{errorMessage}</p>}

            {/* Prikaz vozila */}
            {vozila.length > 0 && (
                <div className="pocetna-grid">
                    {vozila.map(vozilo => (
                        <VoziloCard
                            key={vozilo.id_vozila}
                            vozilo={vozilo}
                            tipKorisnika={tipKorisnika}
                            convert={convert}
                            currency={currency}
                            onVoziloObrisano={id => setVozila(prev => prev.filter(v => v.id_vozila !== id))}
                            onVoziloIzmenjeno={izmenjenoVozilo =>
                                setVozila(prev =>
                                    prev.map(v =>
                                        v.id_vozila === izmenjenoVozilo.id_vozila ? izmenjenoVozilo : v
                                    )
                                )
                            }
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
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
