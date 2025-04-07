import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

const Borrows = () => {
    const location = useLocation();
    const { refreshNotifications } = useNotification();

    useEffect(() => {
        // Nếu có state refresh=true, tức là vừa mượn sách thành công
        if (location.state?.refresh) {
            refreshNotifications();
        }
    }, [location]);

    // ... phần code còn lại của component
};

export default Borrows; 