import { useState } from "react"
import { NodeFunction } from "../../services/FunctionServices";
import { useNavigate } from 'react-router-dom';
import './styles.css';


export const LogIn = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate()



    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await NodeFunction(formData);
        if (response.statusCode == 200){
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
        <div id="login" className="loginContainer">
          <form id="login-form" onSubmit={handleSubmit}>
              <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required></input>
              </div>
              <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required></input>
              </div>
              <div className="ErrorMessage">
                <p>{loginError}</p>
              </div>
              <div>
                <button type="submit" >Log in</button>
              </div>
            </form>
        </div>
    )
}