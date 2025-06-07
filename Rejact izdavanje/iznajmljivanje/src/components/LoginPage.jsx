
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const [userData, setUserData] = useState({
        email: "",
        lozinka: "",
    });
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
            }
        })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data);
                } else {
                    console.log(err);
                }
            });
    }
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Prijava</h2>
                <div className="form-group">
                    <label>Email adresa</label>
                    <input type="email" placeholder="Unesi email" name="email"
                        onInput={handleInput} />

                </div>
                <div className="form-group">
                    <label>Lozinka</label>
                    <input type="password" placeholder="Unesi lozinku" name="lozinka"
                        onInput={handleInput} />
                </div>
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
