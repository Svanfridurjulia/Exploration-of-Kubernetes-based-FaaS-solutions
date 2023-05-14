import Confetti from 'react-confetti';


export const ConfettiDemo = ({ text }) => {
    if (!text) return null;
  
    return (
        <Confetti/>
    );
};
  