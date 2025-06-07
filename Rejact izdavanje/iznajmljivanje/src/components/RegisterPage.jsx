import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function RegisterPage() {
    const [userData, setUserData] = useState({
        ime: "",
        prezime: "",
        email: "",
        lozinka: "",
        tip_korisnika: "autentifikovan", // default vrednost
    });
    let navigate = useNavigate();
    function handleInput(e) {
        // //console.log(e);
        let newUSerData = userData;
        newUSerData[e.target.name] = e.target.value;
        // //console.log(newUSerData);
        setUserData(newUSerData);
    }

    function handleRegister(e) {
        e.preventDefault();
        axios.post("api/register", userData).then(res => {
            console.log(res.data);
            if (res.data.status === "success") {
                navigate("/login");
            }
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                } else {
                    console.log(err);
                }
            });
        console.log(userData);
    }
    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Registracija</h2>

                <div className="form-group">
                    <label>Ime</label>
                    <input
                        type="text"
                        name="ime"

                        onChange={handleInput}
                        placeholder="Unesi ime"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Prezime</label>
                    <input
                        type="text"
                        name="prezime"
                        onChange={handleInput}
                        placeholder="Unesi prezime"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleInput}
                        placeholder="Unesi email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Lozinka</label>
                    <input
                        type="password"
                        name="lozinka"
                        onChange={handleInput}
                        placeholder="Unesi lozinku"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Tip korisnika</label>
                    <select
                        name="tip_korisnika"
                        onChange={handleInput}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="autentifikovan">Autentifikovan</option>
                    </select>
                </div>

                <button type="submit">Registruj se</button>
            </form>
        </div>
    )
}

export default RegisterPage
