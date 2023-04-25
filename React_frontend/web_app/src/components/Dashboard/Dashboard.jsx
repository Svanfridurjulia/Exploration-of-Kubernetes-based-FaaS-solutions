import { UserButton } from "../UserButton/UserButton";
import { Posts } from "../Posts/Posts";
import { useState} from "react";
import { getAllPostItems, addPostItem } from "../../services/postService";
import { getCurrentUser } from "../../services/userService";
import "./styles.css";

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
            <div className="banner">
                <div className="leftElement"><UserButton option1="My Posts" link1="/posts" option2="Log Out" link2="/"/></div>
                <div className="centerElement"><h1 className="bannerTopic">Dashboard</h1></div>   
                <div className="rightElement">
                    <h3>Weather in Reykjavík</h3>
                    <h3>TODO: add info from BP function here.</h3>
                </div>             
            </div>
            
            <div>
                <textarea type="text" className="writePost" placeholder="What's on your mind..." onChange={ e => setPost(e.target.value)} value={post}></textarea>
            </div>
            <button onClick={handleClickPost}>Post</button>
            <Posts posts={items}/>
        </div>
    )
}