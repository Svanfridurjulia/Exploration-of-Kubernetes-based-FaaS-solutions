import './styles.css';


export const PopupBanner = ({ text, onClose }) => {
    if (!text) return null;
  
    return (
        <div className="popupBanner">
            <p className='popupText'>{text}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};
  