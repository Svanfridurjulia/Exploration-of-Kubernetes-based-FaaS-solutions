import { useState } from "react"
import { authenticationNodeFunction } from "../../services/FunctionServices";
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from "../../services/userService";
import './styles.css';

export const LogIn = () => {
    // Use the useState() hook to create state variables for the form data and any login errors.
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate()

    // Go back to the home page.
    const goBack = () => {
        navigate("/");
    }

    // Define a function to handle the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Call the authenticationNodeFunction() service function to authenticate the user.
        const response = await authenticationNodeFunction(formData);

        // If the authentication succeeds, set the current user and navigate to the dashboard page.
        if (response.statusCode === 200){
            setCurrentUser(formData.username);
            navigate('/dashboard');
        }
        // If the authentication fails, display an error message.
        else {
            setLoginError("Username and/or password is incorrect");
        }
    }
    
    // Handle changes to the form inputs.
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value });
    }
    
    // Render the login page.
    return(
        <div>
            <h1 data-testid="pageTitle">Log In</h1>
            <div className="buttonDiv">
                <button data-testid="backButton" className="backButton" onClick={goBack}>Back</button>
            </div>
            <div id="login" className="loginContainer">
                <form data-testid="form" id="loginForm" onSubmit={handleSubmit}>
                    <div>
                        <label data-testid="usernameLabel" htmlFor="username">Username</label>
                        <input data-testid="usernameInput" placeholder="Your Username..." type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="passwordLabel" htmlFor="password">Password</label>
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