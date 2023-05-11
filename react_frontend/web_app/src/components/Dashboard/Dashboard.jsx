import { UserButton } from "../UserButton/UserButton";
import { Posts } from "../Posts/Posts";
import { useState} from "react";
import { getAllPostItems, addPostItem } from "../../services/postService";
import { getCurrentUser } from "../../services/userService";
import { demoPythonFunction, writePostNodeFunction } from "../../services/FunctionServices";
import { PopupBanner } from "../PopUpBanner/PopUpBanner";
import "./styles.css";

export const Dashboard = () => {
    // Define state variables using the useState() hook.
    const [post, setPost] = useState('');
    const [items, setItems] = useState(() => getAllPostItems());
    const [popUpText, setPopUpText] = useState('');
    const name = getCurrentUser();

    // Click event handler for the "Post" button.
    const handleClickPost = () => {
        const date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        if (post.trim() === "") {
            return;
        }
        // Add the new post item to the server using the addPostItem() function from the postService module.
        addPostItem({user: name, time:currentDate, post: post});
        writePostNodeFunction({username:name, post_text:post});
        // Update the items state variable with the new post item
        setItems(getAllPostItems);
        // Reset the post state variable to an empty string. 
        setPost('');
    }

    // Click event handler for the "Demo" button.
    const handleClickDemo = async (event) => {
        event.preventDefault();

        // Call the demoPythonFunction() function from the FunctionServices module to send a demo request to the server.
        const response = await demoPythonFunction();
        // Set the popUpText state variable to the response from the server.
        setPopUpText(response);
    }

    // Close the popup banner.
    const closePopup = () => {
        setPopUpText('');
    };
    
    // Render the dashboard component.
    return (
        <div>
            <div className="banner">
                <div className="leftElement">
                    <UserButton option1="My Posts" link1="/posts" option2="Log Out" link2="/"/>
                </div>
                <div className="centerElement"><h1 data-testid="banner" className="bannerTopic">Dashboard</h1>
                    <PopupBanner text={popUpText} onClose={closePopup}></PopupBanner>
                    <button data-testid="demoButton" onClick={handleClickDemo}>Demo</button>
                </div>            
            </div>
            
            <div>
                <textarea type="text" id="writePost" className="writePost" placeholder="What's on your mind..." onChange={ e => setPost(e.target.value)} value={post}></textarea>
            </div>
            <button data-testid="postButton" onClick={handleClickPost}>Post</button>
            <Posts posts={items}/>
        </div>
    )
}
