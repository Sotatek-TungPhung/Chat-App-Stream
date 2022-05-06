import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import App from './pages/App';
import FeedActivity from './pages/FeedActivity'
import './index.css';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}/>
            <Route path="/feed" element={<FeedActivity />}/>
        </Routes>
    </BrowserRouter>
, document.getElementById('root'));