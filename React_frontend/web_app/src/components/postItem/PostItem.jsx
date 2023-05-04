import './styles.css';
import { translationPythonFunction } from '../../services/FunctionServices';
import { useState } from 'react';

export const PostItem = ({id, user, time, post}) => {
    const [translated, setTranslated] = useState(false);
    const [translatedText, setTranslatedText] = useState(post);

    const handleClick = async (event) => {
        event.preventDefault();
        const response = await translationPythonFunction({"text": post});
        const obj = JSON.parse(response);
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