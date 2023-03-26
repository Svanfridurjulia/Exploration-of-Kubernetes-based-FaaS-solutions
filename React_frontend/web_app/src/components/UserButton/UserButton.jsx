import { useState } from "react"
import { Link} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import "./style.css";



export const UserButton = ({option1, link1, option2, link2}) => {
    const [dropdown, setDropdown] = useState(false);    

    const handleDropdownClick = () => {
        setDropdown(!dropdown);
    }

    return (
        <div className="userContainer">
            <button className="userButton" onClick={handleDropdownClick} >
                <FontAwesomeIcon icon={faUser} />
            </button>
            {(dropdown) ? (
                    <ul className="menu">
                        <li className="menu-item">
                            <button><Link to={link1}>{option1}</Link></button>
                        </li>
                        <li className="menu-item">
                            <button><Link to={link2}>{option2}</Link></button>
                        </li>
                    </ul>
                )
                :(
                    null
                )
            }
        </div>
    )
}