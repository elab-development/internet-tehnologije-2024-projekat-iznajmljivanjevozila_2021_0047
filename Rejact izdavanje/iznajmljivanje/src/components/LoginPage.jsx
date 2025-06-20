
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const [userData, setUserData] = useState({
        email: "",
        lozinka: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate();
    function handleInput(e) {
        // //console.log(e);
        let newUSerData = userData;
        newUSerData[e.target.name] = e.target.value;
        // //console.log(newUSerData);
        setUserData(newUSerData);

    }

    function handleLogin(e) {

        e.preventDefault();
        axios.post("api/login", userData).then(res => {
            console.log(res.data);
            if (res.data.status === "success") {
                window.sessionStorage.setItem("auth_token", res.data.token);
                navigate("/");
                window.location.reload();
            }
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                    setErrorMessage(err.response.data.message || "Došlo je do greške pri prijavi.");
                } else {
                    console.log(err);
                    setErrorMessage("Greška u mreži ili serveru.");
                }
            });
    }
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Prijava</h2>
                <div className="form-group">
                    <label htmlFor="email">Email adresa</label>
                    <input
                        type="email"
                        placeholder="Unesi email"
                        name="email"
                        id="email"
                        onInput={handleInput}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lozinka">Lozinka</label>
                    <input
                        type="password"
                        placeholder="Unesi lozinku"
                        name="lozinka"
                        id="lozinka"
                        onInput={handleInput}
                        required
                    />
                </div>
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                <button type="submit">Prijavi se</button>
            </form>
            <p>
                Nemate nalog?{' '}
                <a href="/register">Registrujte se</a>
            </p>
        </div>
    )
}

export default LoginPage
