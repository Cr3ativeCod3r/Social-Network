// App.js
// import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Home from './components/Home.tsx';
import Chat from './components/Chat.tsx';
import Gold from './components/Gold.tsx';
import Announcements from './components/Announcements.tsx';

function App() {
    return (

        <Layout>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/zlote" element={<Gold/>}/>
                <Route path="/Announcements" element={<Announcements/>}/>
            </Routes>
        </Layout>

    );
}

export default App;
