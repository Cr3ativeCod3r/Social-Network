import React, {ReactNode} from 'react';
import Navbar from './components/Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <>
            <Navbar/>
            <div>{children}</div>
        </>
    );
};

export default Layout;
