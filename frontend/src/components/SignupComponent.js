import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { isLoginpage } from '../store/reducers/menu';

export default function Signup() {
    // State variables for email, password, emailExists, and successful signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [succesfull, setSuccesfull] = useState(false);

    // Redux state and dispatch
    const dispatch = useDispatch();
    const { loginpage } = useSelector((state) => state.menu);
    const [Loginpage, setLoginpage] = useState(loginpage);

    // Function to handle email input change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Function to handle password input change
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        axios.post('http://localhost:3001/signup', { Email: email, Password: password}).then((res)=>{
            console.log(res.data.message)
            if (res.data.message == "Email already exists") { 
                setEmailExists(true);
                setTimeout(() =>{
                    setEmailExists(false);
                }, 2000);
            } else if (res.data.message == "Signup successful") { 
                setSuccesfull(true);
                setTimeout(() =>{
                    setSuccesfull(false);
                }, 2000);
            }
        });
    };

    // Function to handle login button click
    const handleLogin = () =>{
        dispatch(isLoginpage({loginpage: !Loginpage}));
    };

    return (
        <div className="wrapper signIn">
            <div className="form">
                <h1>Geo-Data App</h1>
                <div className="heading">SIGN UP</div>
                <form>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} />
                    </div>
                    {/* Conditional rendering of submit button */}
                    {email !== "" && password !== "" ? <Button variant="contained" onClick={handleSubmit}>SUBMIT</Button>: <Button variant="contained" disabled>SUBMIT</Button>}
                    {/* Alert for existing email */}
                    {emailExists && <Alert severity="error">Email already exists.</Alert>}
                    {/* Alert for successful signup */}
                    {succesfull && <Alert severity="success">Signup successful.</Alert>}
                </form>
                {/* Login button */}
                <Button variant="contained" onClick={handleLogin}>LOGIN</Button>
            </div>
        </div>
    );
}
