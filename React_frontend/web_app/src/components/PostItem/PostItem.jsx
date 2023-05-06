import './styles.css';
import { translationPythonFunction } from '../../services/FunctionServices';
import { useState } from 'react';

export const PostItem = ({id, user, time, post}) => {
    // Define state variables using the useState() hook.
    const [translated, setTranslated] = useState(false);
    const [translatedText, setTranslatedText] = useState(post);

    // Handles click on the translate button by calling the translation function and setting the translated text.
    const handleClick = async (event) => {
        event.preventDefault();
        // Calls the translation function with the post text.
        const response = await translationPythonFunction({"text": post});
        const obj = JSON.parse(response);
        // Sets the translated text in state.
        setTranslatedText(obj.text);
        setTranslated(true);
    }

    return (
        <div className='postContainer'>
            <div className='post'>
                <p data-testid="postedBy" className='info'>{user} on {time}</p>
                <p data-testid="postMessage" className='postMessage'>{post}</p>
                    {(translated) ? (
                        <div>
                            <p data-testid="translation" className='translation'>Spanish translation: {translatedText}</p>
                        </div>
                    )
                    :(
                        null
                    )
                }
            </div>
            <button data-testid="translateButton" className='translateButton' onClick={handleClick}>Translate</button>
        </div>
    )
}