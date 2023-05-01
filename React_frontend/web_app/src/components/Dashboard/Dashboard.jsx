import { UserButton } from "../UserButton/UserButton";
import { Posts } from "../Posts/Posts";
import { useState} from "react";
import { getAllPostItems, addPostItem } from "../../services/postService";
import { getCurrentUser } from "../../services/userService";
import { demoPythonFunction } from "../../services/FunctionServices";
import { PopupBanner } from "../PopUpBanner/PopUpBanner";
import "./styles.css";

export const Dashboard = () => {
    const [post, setPost] = useState('');
    const [items, setItems] = useState(() => getAllPostItems());
    const [popUpText, setPopUpText] = useState('');
    const name = getCurrentUser();

    const handleClickPost = () => {
        const date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        addPostItem({user: name, time:currentDate, post: post})
        setItems(getAllPostItems);
        setPost('');
    }


    const handleClickDemo = async (event) => {
        event.preventDefault();
        const response = await demoPythonFunction();
        setPopUpText(response);
    }

    const closePopup = () => {
        setPopUpText('');
      };
    
    return (
        <div>
            <div className="banner">
                <div className="leftElement"><UserButton option1="My Posts" link1="/posts" option2="Log Out" link2="/"/></div>
                <div className="centerElement"><h1 className="bannerTopic">Dashboard</h1>
                    <PopupBanner text={popUpText} onClose={closePopup}></PopupBanner>
                    <button onClick={handleClickDemo}>Demo</button>
                
                </div>   
                <div className="rightElement">
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
