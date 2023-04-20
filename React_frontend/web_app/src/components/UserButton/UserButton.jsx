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
                    <div className="dropdown">
                         {/* onClick={goToLink(link1)} */}
                        <button className="dropButton"><Link className="linked" to={link1}>{option1}</Link></button>
                        <button className="dropButton"><Link className="linked" to={link2}>{option2}</Link></button>
                    </div>
                )
                :(
                    null
                )
            }
        </div>
    )
}