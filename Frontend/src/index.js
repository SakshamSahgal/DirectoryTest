import ReactDOM from 'react-dom/client';
import App from './App';

import axios from 'axios';

if(process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = process.env.REACT_APP_ServerLocalHost;
}else{
    axios.defaults.baseURL = process.env.REACT_APP_ServerRemoteHost;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
