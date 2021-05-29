import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorMessage from "../misc/ErrorMessage";
import "./AuthForm.scss";

function Login() {
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");

    // Display error messages to user instead of http error codes
    const [errorMessage, setErrorMessage] = useState(null);

    const {getUser} = useContext(UserContext);

    const history = useHistory();

    async function login(e) {
        e.preventDefault();

        const loginData = {
            email: formEmail,
            password: formPassword
        };

        try {
            await axios.post("http://localhost:5000/auth/login", loginData);
        }
        catch (err) {
            if (err.response) {
                if (err.response.data.errorMessage) {
                    setErrorMessage(err.response.data.errorMessage);
                }
            }
            return;
        }

        await getUser();
        history.push("/");
    }

    return (
        <div className = "auth-form">
            <h2>Login</h2>

            {
                errorMessage && (
                    <ErrorMessage 
                        message = {errorMessage} 
                        clear = {() => setErrorMessage(null)}
                    />
                )
            }

            <form className = "form" onSubmit = {login}>
                <label htmlFor = "form-email">Email</label>
                <input 
                    id = "form-email"
                    type = "email" 
                    value = {formEmail} 
                    onChange = { (e) => setFormEmail(e.target.value) } 
                />

                <label htmlFor = "form-password">Password</label>
                <input 
                    id = "form-password"
                    type = "password" 
                    value = {formPassword} 
                    onChange = { (e) => setFormPassword(e.target.value) } 
                />

                <button className = "button-login" type = "submit">Login</button>
            </form>
        
            <p>
                Don't have an account? <Link to = "/register">Register here</Link>
            </p>

        </div>
    );
}

export default Login;