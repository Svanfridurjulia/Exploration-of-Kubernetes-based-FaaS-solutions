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
        const {name, value} = event.target;
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
    
    return(
      <div>
        <h1>Sign Up</h1>
        <div className="buttonDiv">
          <button className="backButton" onClick={goBack}>Back</button>
        </div>
        <div id="signUp" className="signUpContainer">
          <form id="signup-form" onSubmit={handleSubmit}>
            <div>
                <label for="username">Name:</label>
                <input placeholder="Your Full Name..." type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required></input>
              </div>
              <div>
                <label for="username">Username:</label>
                <input placeholder="Your Username..." type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
              </div>
              <div>
                <label for="password">Password:</label>
                <input placeholder="Your Password..." type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required></input>
              </div>
              <div className="pwGenerator">
                <button type="button" onClick={randomPw} className="diceButton">Generate random password</button>
              </div>
              {(pwGenerated) ? (
                        <div>
                            <p className="pw">{pw}</p>
                        </div>
                    )
                    :(
                        null
                    )
                }
              <div className="ErrorMessage">
                <p>{signUpError}</p>
              </div>
              <div>
                <button className="subButton" type="submit" >Sign Up</button>
              </div>
            </form>
        </div>
      </div> 
    )
}