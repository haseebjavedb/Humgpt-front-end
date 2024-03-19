import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useTitle = (title) => {
    const location = useLocation();

    useEffect(() => {
        document.title = title + " | HumGPT.AI";
    }, [location, title]);
}

export default useTitle;