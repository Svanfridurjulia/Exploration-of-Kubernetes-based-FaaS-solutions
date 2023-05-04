import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from "../../services/userService";
import { passwordGoFunction, writeUserPythonFunction } from "../../services/FunctionServices";
import { sendEmailGoFunction } from "../../services/FunctionServices";
import './styles.css';

export const SignUp = () => {
    const [pwGenerated, setPwGenerated] = useState(false);
    const [pw, setPw] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: ""
    });
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        sendEmailGoFunction(formData.username);
        const response = await writeUserPythonFunction(formData);
        setCurrentUser(formData.username);
        navigate('/dashboard');
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const goBack = () => {
        navigate("/");
    }

    const randomPw = async (event) => {
        event.preventDefault();
        // Call the appropriate OpenFaaS function
        const response = await passwordGoFunction();
        console.log(response);
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
                        <label data-testid="nameLabel" for="name">Name:</label>
                        <input data-testid="nameInput" placeholder="Your Full Name..." type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="usernameLabel" for="username">Username:</label>
                        <input data-testid="usernameInput" placeholder="Your Username..." type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
                    </div>
                    <div>
                        <label data-testid="passwordLabel" for="password">Password:</label>
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
                    <div className="ErrorMessage">
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