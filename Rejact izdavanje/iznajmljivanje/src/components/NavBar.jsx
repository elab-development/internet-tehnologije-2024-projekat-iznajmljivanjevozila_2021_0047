import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const NavBar = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);

    function handleLogout(e) {
        e.preventDefault();
        const token = window.sessionStorage.getItem("auth_token");

        if (!token) {
            console.warn("Nema auth tokena u sessionStorage.");
            return;
        }

        axios.post('api/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        })
            .then(response => {
                console.log("Logout uspešan:", response.data);
                window.sessionStorage.removeItem("auth_token");
                setTipKorisnika(null);
                navigate("/login");
            })
            .catch(error => {
                console.error("Greška pri logoutu:", error.response?.data || error.message);
                // Brišemo token čak i ako logout server odbije
                window.sessionStorage.removeItem("auth_token");
                navigate("/login");
            });
    }
    const [tipKorisnika, setTipKorisnika] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
            setTipKorisnika(null);
            return;
        }

        axios.get("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setTipKorisnika(res.data.tip_korisnika);

            })
            .catch(err => {
                console.error("Greška pri dohvaćanju korisnika", err);
            });
    }, []);


    const styles = {
        navbar: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,  // da bude iznad ostalog sadržaja
            height: '50px',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1e40af",
            padding: "10px 20px",
        },
        logo: {
            color: "#f9fafb",
            fontWeight: "700",
            fontSize: "28px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            cursor: "default",
        },
        navLinks: {
            listStyle: "none",
            display: "flex",
            gap: "25px",
            margin: 0,
            padding: 0,
        },
        link: {
            color: "#e0e7ff",
            textDecoration: "none",
            fontSize: "18px",
            fontWeight: "600",
            transition: "color 0.3s ease",
        },
        linkHover: {
            color: "#60a5fa",
        },
    };

    const links = [
        { path: "/pocetna", label: "Pregled vozila" },
        { path: "/login", label: "Login", authRequired: false },
        { path: "/register", label: "Registracija", authRequired: false },
        { path: "/", label: "Početna" },
    ];

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginRight: "10px" }}
                >
                    <path d="M5 11h14l1.5-4.5h-17zM7 16c-.83 0-1.5-.67-1.5-1.5S6.17 13 7 13s1.5.67 1.5 1.5S7.83 16 7 16zm10 0c-.83 0-1.5-.67-1.5-1.5S16.17 13 17 13s1.5.67 1.5 1.5S17.83 16 17 16zM18.92 6c-.21-.6-.78-1-1.42-1H6.5c-.64 0-1.21.4-1.42 1L3 11v8c0 .55.45 1 1 1s1-.45 1-1v-1h14v1c0 .55.45 1 1 1s1-.45 1-1v-8l-2.08-5z" />
                </svg>
                VoziloNaDan
            </div>
            <ul style={styles.navLinks}>
                <li>
                    <Link
                        to="/"
                        style={hovered === "home" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => setHovered("home")}
                        onMouseLeave={() => setHovered(null)}
                    >
                        Početna
                    </Link>
                </li>
                <li>
                    <Link
                        to="/pocetna"
                        style={hovered === "pocetna" ? { ...styles.link, ...styles.linkHover } : styles.link}
                        onMouseEnter={() => setHovered("pocetna")}
                        onMouseLeave={() => setHovered(null)}
                    >
                        Pregled vozila
                    </Link>
                </li>
                {tipKorisnika === "admin" && (
                    <li>
                        <Link
                            to="/admin/korisnici"
                            style={hovered === "pregled-korisnika" ? { ...styles.link, ...styles.linkHover } : styles.link}
                            onMouseEnter={() => setHovered("pregled-korisnika")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Pregled korisnika
                        </Link>
                    </li>
                )}
                {tipKorisnika === "autentifikovan" && (
                    <li>
                        <Link
                            to="/profil"
                            style={hovered === "prefil" ? { ...styles.link, ...styles.linkHover } : styles.link}
                            onMouseEnter={() => setHovered("profil")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Moj profil
                        </Link>
                    </li>
                )}
                {tipKorisnika === "admin" && (
                    <li>
                        <Link
                            to="/admin/dodajVozilo"
                            style={hovered === "dodaj-vozilo" ? { ...styles.link, ...styles.linkHover } : styles.link}
                            onMouseEnter={() => setHovered("dodaj-vozilo")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Dodaj vozilo
                        </Link>
                    </li>
                )}
                {tipKorisnika === "admin" && (
                    <li>
                        <Link
                            to="/admin/statistika"
                            style={hovered === "statistika" ? { ...styles.link, ...styles.linkHover } : styles.link}
                            onMouseEnter={() => setHovered("statistika")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Statistika
                        </Link>
                    </li>
                )}

                {window.sessionStorage.getItem("auth_token") == null ? (
                    <>
                        <li>
                            <Link
                                to="/login"
                                style={hovered === "login" ? { ...styles.link, ...styles.linkHover } : styles.link}
                                onMouseEnter={() => setHovered("login")}
                                onMouseLeave={() => setHovered(null)}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register"
                                style={hovered === "register" ? { ...styles.link, ...styles.linkHover } : styles.link}
                                onMouseEnter={() => setHovered("register")}
                                onMouseLeave={() => setHovered(null)}
                            >
                                Registracija
                            </Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <a
                            href="/logout"
                            onClick={handleLogout}
                            style={hovered === "logout" ? { ...styles.link, ...styles.linkHover, cursor: "pointer" } : styles.link}
                            onMouseEnter={() => setHovered("logout")}
                            onMouseLeave={() => setHovered(null)}
                        >
                            Logout
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default NavBar
