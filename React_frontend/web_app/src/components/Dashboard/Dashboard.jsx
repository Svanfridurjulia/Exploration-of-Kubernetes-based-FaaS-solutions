import { UserButton } from "../UserButton/UserButton";
import { Posts } from "../Posts/Posts";
import { useState} from "react";
import { getAllPostItems, addPostItem } from "../../services/postService";
import { getCurrentUser } from "../../services/userService";

export const Dashboard = () => {
    const [post, setPost] = useState('');
    const [items, setItems] = useState(() => getAllPostItems());
    const name = getCurrentUser();

    const handleClickPost = () => {
        const date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        addPostItem({user: name, time:currentDate, post: post})
        setItems(getAllPostItems);
        setPost('');
    }
    
    return (
        <div>
            <UserButton option1="Posts" link1="/posts" option2="Log Out" link2="/"/>
            <h1>Dashboard</h1>
            <div>
            </div>
            <div>
                <input onChange={ e => setPost(e.target.value)} value={post}></input>
                <button onClick={handleClickPost}>Post</button>
            
            </div>
            <Posts posts={items}/>
        </div>
    )
}