import { useState } from "react"
import { getAllUserPostItems } from "../../services/postService";
import { Posts } from "../Posts/Posts";
import { getCurrentUser } from "../../services/userService";
import { UserButton } from "../UserButton/UserButton";

export const UserProfile = () => {
    const name = getCurrentUser();
    const [items, setItems] = useState(() => getAllUserPostItems(name)); 
    return (<div>
        <UserButton option1="Dashboard" link1="/dashboard" option2="Log Out" link2="/"/>
        <h1>MY POSTS</h1>
        <Posts posts={items}></Posts>
    </div>)
}