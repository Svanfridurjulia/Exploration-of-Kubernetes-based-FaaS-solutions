import { useNavigate } from "react-router-dom";
import './styles.css';

export const HomePage = () => {
    // Use the useNavigate() hook to get access to the navigation object.
    const navigate = useNavigate();


    // Functions that navigate to the log in and sign up pages.
    const goToLogIn = () => {
        navigate("/login");
    }
    const goToSignUp = () => {
        navigate("/signup");
    }
    	
    // Render the home page.
    return (
        <div className="homePage">
            <h1 data-testid="pageName" className="pageName">Welcome to Fabulous as a Service!</h1>
            <button data-testid="logInButton" className="buttonLook" onClick={goToLogIn}>
                Log In
            </button>
            <button data-testid="signInButton" className="buttonLook" onClick={goToSignUp}>
                Sign Up
            </button>
            <h2 data-testid="header2">About this web application</h2>
            <p data-testid="paragraph1">This web application was created as a part of a final project done by three students finishing their Bachelor degrees in Computer Science and Software Engineering.</p>
            <p data-testid="paragraph2">The aim of this project is to explore how Function as a Service can be used on top of Kubernetes.</p>
        </div>
    )
}