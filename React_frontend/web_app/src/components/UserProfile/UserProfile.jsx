import { useState } from "react"
import { getAllUserPostItems } from "../../services/postService";
import { Posts } from "../Posts/Posts";
import { getCurrentUser } from "../../services/userService";
import { UserButton } from "../UserButton/UserButton";
import "./styles.css";

export const UserProfile = () => {
    const name = getCurrentUser();
    const [items, setItems] = useState(() => getAllUserPostItems(name)); 
    return (
        <div>
            <div className="banner">
                <div className="leftElement"><UserButton option1="Dashboard" link1="/dashboard" option2="Log Out" link2="/"/></div>
                <div className="centerElement"><h1 className="bannerTopic">My Posts</h1></div>                
            </div>
            <Posts posts={items}></Posts>
        </div>
    )
}