import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from "../../services/userService";
import { passwordGoFunction, writeUserPythonFunction } from "../../services/FunctionServices";
import { sendEmailGoFunction } from "../../services/FunctionServices";
import './styles.css';

export const SignUp = () => {
    // Define state variables using useState
    const [pwGenerated, setPwGenerated] = useState(false);
    const [pw, setPw] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: ""
    });
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate()

    // Called when the form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Call the appropriate OpenFaaS function to send an email to the user
        sendEmailGoFunction(formData.username);
        // Call the appropriate OpenFaaS function to write the user data to a database
        const response = await writeUserPythonFunction(formData);
        // Set the current user using the setCurrentUser function from userService
        setCurrentUser(formData.username);
        // Navigate to the dashboard
        navigate('/dashboard');
    }

    // Called when a field in the form is changed
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Update the corresponding field in the formData state object
        setFormData({ ...formData, [name]: value });
    }

    // Define a function that is called when the Back button is clicked
    const goBack = () => {
        navigate("/");
    }

    // Define a function that is called when the Generate random password button is clicked
    const randomPw = async (event) => {
        event.preventDefault();
        // Call the appropriate OpenFaaS function to generate a random password
        const response = await passwordGoFunction();
        // console.log(response);
        // Set the state variables to display the generated password
        setPwGenerated(true);
        setPw(response);
    }

    return (
        <div>
            <h1 data-testid="pageTitle">Sign Up</h1>
            <div className="buttonDiv">
                <button data-testid="backButton" className="backButton" onClick={goBack}>Back</button>
            </div>
            <div id="signUp" className="signUpContainer">
                <form data-testid="signupForm" id="signupForm" onSubmit={handleSubmit}>
                    <div>
                        <label data-testid="nameLabel" htmlFor="name">Name:</label>
                        <input data-testid="nameInput" placeholder="Your Full Name..." type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="usernameLabel" htmlFor="username">Username:</label>
                        <input data-testid="usernameInput" placeholder="Your Username..." type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="passwordLabel" htmlFor="password">Password:</label>
                        <input data-testid="passwordInput" placeholder="Your Password..." type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required></input>
                    </div>
                    <div className="pwGenerator">
                        <button data-testid="diceButton" type="button" onClick={randomPw} className="diceButton">Generate random password</button>
                    </div>
                    {(pwGenerated) ? (
                        <div>
                            <p data-testid="generatedPassword" className="pw">{pw}</p>
                        </div>
                    )
                        : (
                            null
                        )
                    }
                    <div className="errorMessage">
                        <p>{signUpError}</p>
                    </div>
                    <div>
                        <button data-testid="subButton" className="subButton" type="submit" >Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}