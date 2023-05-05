import { useState } from "react"
import { Link} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "./styles.css";

export const UserButton = ({option1, link1, option2, link2}) => {
    // Declare state variables for managing the dropdown
    const [dropdown, setDropdown] = useState(false);    

    // Event handler for the dropdown button click
    const handleDropdownClick = () => {
        // Toggle the dropdown state
        setDropdown(!dropdown);
    }

    return (
        <div data-testid={option1} className="userContainer">
            <button data-testid="profileButton" className="userButton" onClick={handleDropdownClick} >
                <FontAwesomeIcon icon={faUser} />
            </button>
            {/* Render the dropdown menu if the dropdown state is true */}
            {(dropdown) ? (
                    <div data-testid="dropdownDiv" className="dropdown">
                        <button data-testid="dropButton1" className="dropButton"><Link className="linked" to={link1}>{option1}</Link></button>
                        <button data-testid="dropButton2" className="dropButton"><Link className="linked" to={link2}>{option2}</Link></button>
                    </div>
                )
                :(
                    // Render nothing if the dropdown state is false
                    null
                )
            }
        </div>
    )
}