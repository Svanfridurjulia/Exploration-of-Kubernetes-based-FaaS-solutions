import { useState } from "react"
import { NodeFunction } from "../../services/FunctionServices";
import { useNavigate } from 'react-router-dom';
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
        navigate('/dashboard');
        // if (response.statusCode == 200){
        //     navigate('/dashboard');
        //     }
        // else {
        //     setSignUpError("Username and/or password is incorrect");
        // }


    }
    
    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({ ...formData, [name]: value });
    }
    
    
    
    return(
        <div id="signUp" className="signUpContainer">
          <form id="signup-form" onSubmit={handleSubmit}>
            <div>
                <label for="username">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}></input>
              </div>
              <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange}></input>
              </div>
              <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange}></input>
              </div>
              <div className="ErrorMessage">
                <p>{signUpError}</p>
              </div>
              <div>
                <button type="submit" >Sign Up</button>
              </div>
            </form>
        </div>
    )
}