import { useState } from "react"
import { goFunction } from "../../services/FunctionServices";
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from "../../services/userService";
import './styles.css';


export const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: ""
    });
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        // const response = await NodeFunction(formData);
        const response = await goFunction();
        console.log(response);
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
              <div className="ErrorMessage">
                <p>{signUpError}</p>
              </div>
              <div>
                <button type="submit" >Sign Up</button>
              </div>
            </form>
        </div>
      </div>
        
    )
}