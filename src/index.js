import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Helpers from './App/Config/Helpers';
import { GoogleOAuthProvider } from '@react-oauth/google';

Helpers.toggleCSS();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <GoogleOAuthProvider clientId="9745213746-sqsnhe5o1njvvul2ouqd5qkvfbm7r16r.apps.googleusercontent.com">
    <App />
  // </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
