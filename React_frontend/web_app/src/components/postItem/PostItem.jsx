import './style.css';
import { pythonFunction } from '../../services/FunctionServices';
import { useState } from 'react';

export const PostItem = ({
    id,
    user,
    time,
    post
}) => {

    const [translated, setTranslated] = useState(false);
    const [translatedText, setTranslatedText] = useState(post);

    const handleClick = async (event) => {
        event.preventDefault();
        const response = await pythonFunction({"text": post});
        const obj = JSON.parse(response);
        setTranslatedText(obj.text);
        setTranslated(true);
    }

    return (
        <div className='postContainer'>
            <div className='post'>
                <p className='info'>{user} on {time}</p>
                <p className='postMessage'>{post}</p>
                    {(translated) ? (
                        <div>
                            <p className='translation'>Spanish translation: {translatedText}</p>
                        </div>
                    )
                    :(
                        null
                    )
                }
            </div>
            <button className='translateButton' onClick={handleClick}>Translate</button>
        </div>
    )

}