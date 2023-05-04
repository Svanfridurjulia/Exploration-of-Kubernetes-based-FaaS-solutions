import { useState } from "react"
import { authenticationNodeFunction } from "../../services/FunctionServices";
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from "../../services/userService";
import './styles.css';

export const LogIn = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate()

    const goBack = () => {
        navigate("/");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        const response = await authenticationNodeFunction(formData);
        console.log(response);
        if (response.statusCode === 200){
            setCurrentUser(formData.username);
            navigate('/dashboard');
        }
        else {
            setLoginError("Username and/or password is incorrect");
        }
    }
    
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value });
    }
    
    return(
        <div>
            <h1 data-testid="pageTitle">Log In</h1>
            <div className="buttonDiv">
                <button data-testid="backButton" className="backButton" onClick={goBack}>Back</button>
            </div>
            <div id="login" className="loginContainer">
                <form data-testid="form" id="loginForm" onSubmit={handleSubmit}>
                    <div>
                        <label data-testid="usernameLabel" for="username">Username</label>
                        <input data-testid="usernameInput" placeholder="Your Username..." type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="passwordLabel" for="password">Password</label>
                        <input data-testid="passwordInput" placeholder="Your Password..." type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required></input>
                    </div>
                    <div className="errorMessage">
                        <p>{loginError}</p>
                    </div>
                    <div>
                        <button data-testid="logInButton" type="submit">Log in</button>
                    </div>
                </form>
            </div>
        </div>
    )
}