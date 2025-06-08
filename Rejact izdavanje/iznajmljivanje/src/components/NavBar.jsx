import axios from 'axios';
import React from 'react'
import { useState } from 'react';
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
                navigate("/login");
            })
            .catch(error => {
                console.error("Greška pri logoutu:", error.response?.data || error.message);
                // Brišemo token čak i ako logout server odbije
                window.sessionStorage.removeItem("auth_token");
                navigate("/login");
            });
    }

    const styles = {
        navbar: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,  // da bude iznad ostalog sadržaja
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
    ];

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>VoziloNaDan</div>
            <ul style={styles.navLinks}>
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
