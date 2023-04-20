import { useNavigate } from "react-router-dom";
import './styles.css';


export const HomePage = () => {
    const navigate = useNavigate();

    const goToLogIn = () => {
        navigate("/login");
    }

    const goToSignUp = () => {
        navigate("/signup");
    }

    return (
        <div className="homePage">
            <h1 className="pageName">Welcome to FaaS-App!</h1>
            <button className="buttonLook" onClick={goToLogIn}>
                Log In
            </button>
            <button className="buttonLook" onClick={goToSignUp}>
                Sign Up
            </button>
            <h2>About this web application</h2>
            <p>This web application was created as a part of a final project done by three students finishing their Bachelor degrees in Computer Science and Software Engineering.</p>
            <p>The aim of this project is to explore how Function as a Service can be used on top of Kubernetes.</p>
        </div>
    )
}