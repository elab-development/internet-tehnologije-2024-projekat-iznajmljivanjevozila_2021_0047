import React from 'react'

function NavBar() {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>VoziloNaDani</div>
            <ul style={styles.navLinks}>
                <li><a href="/" style={styles.link}>Početna</a></li>
                {window.sessionStorage.getItem("auth_token") == null ?
                    (<li><a href="/login" style={styles.link}>Login</a></li>) :
                    (<li><a href="/logout" style={styles.link}>Logout</a></li>)}

                <li><a href="/register" style={styles.link}>Registracija</a></li>
            </ul>
        </nav>
    )

} const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#333",
        padding: "10px 20px",
    },
    logo: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: "24px",
    },
    navLinks: {
        listStyle: "none",
        display: "flex",
        gap: "15px",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "18px",
    },
};

export default NavBar
