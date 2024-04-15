import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import "../styles.css";
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { isLogin, isLoginpage } from '../store/reducers/menu';

export default function Login() {
    // State variables for email, password, and login status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    
    // Redux state for login and login page status
    const { login } = useSelector((state) => state.menu);
    const { loginpage } = useSelector((state) => state.menu);
    const [Login, setLogin] = useState(login);
    const [Loginpage, setLoginpage] = useState(loginpage);

    // State variables for email existence and wrong password
    const [emailExists, setEmailExists] = useState(false);
    const [wrongPass, setWrongPass] = useState(false);

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
        axios.post('http://localhost:3001/login', { Email: email, Password: password}).then((res)=>{
            console.log(res.data.message)
            if (res.data.message === "Email does not exist") { 
                setEmailExists(true);
                setTimeout(()=>{
                    setEmailExists(false);
                }, 2000);
            } else if (res.data.message == "Wrong password") { 
                setWrongPass(true);
                setTimeout(()=>{
                    setWrongPass(false);
                }, 2000);
            } else if (res.data.message == "Login successful") { 
                dispatch(isLogin({ login: !Login }));
                sessionStorage.setItem("Login", "true");
                sessionStorage.setItem("email", email);
            }
        });
    };

    // Function to handle signup button click
    const handleSignup = () =>{
        dispatch(isLoginpage({loginpage: !Loginpage}));
    };

    return (
        <div className="wrapper signIn">
            <div className="form">
                <h1>Geo-Data App</h1>
                <div className="heading">LOGIN</div>
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
                </form>
                {/* Signup button */}
                <Button variant="contained" onClick={handleSignup}>SIGN UP</Button>
            </div>
        </div>
    );
}
