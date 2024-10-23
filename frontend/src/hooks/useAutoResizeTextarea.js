import { useEffect, useRef } from 'react';

const useAutoResizeTextarea = () => {
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            const resizeTextarea = () => {
                textarea.style.height = 'auto'; 
                textarea.style.height = `${textarea.scrollHeight}px`;
            };

            resizeTextarea();

            textarea.addEventListener('input', resizeTextarea);

            return () => {
                textarea.removeEventListener('input', resizeTextarea); 
            };
        }
    }, []);

    return textareaRef;
};

export default useAutoResizeTextarea;
