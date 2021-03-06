import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorMessage from "../misc/ErrorMessage";
import "./AuthForm.scss";

function Register() {
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formPasswordConfirm, setFormPasswordConfirm] = useState("");

    // Display error messages to user instead of http error codes
    const [errorMessage, setErrorMessage] = useState(null);

    const {getUser} = useContext(UserContext);

    const history = useHistory();

    async function register(e) {
        e.preventDefault();

        const registerData = {
            email: formEmail,
            password: formPassword,
            passwordConfirm: formPasswordConfirm
        };

        try {
            await axios.post("http://localhost:5000/auth/", registerData);
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
    };

    return (
        <div className = "auth-form">
            <h2>Register a new account</h2>

            {
                errorMessage && (
                    <ErrorMessage 
                        message = {errorMessage} 
                        clear = {() => setErrorMessage(null)}
                    />
                )
            }

            <form className = "form" onSubmit = {register}>
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

                <label htmlFor = "form-passwordConfirm">Confirm Password</label>
                <input 
                    id = "form-passwordConfirm"
                    type = "password" 
                    value = {formPasswordConfirm} 
                    onChange = { (e) => setFormPasswordConfirm(e.target.value) } 
                />

                <button className = "button-register" type = "submit">Register</button>
            </form>
        
            <p>
                Already registered? <Link to = "/login">Login here instead</Link>
            </p>

        </div>
    );
}

export default Register;