import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppContextProvider } from './context/AppContext'; 
import {ClerkProvider} from '@clerk/clerk-react'


const PUBLISHABLE_KEY = "pk_test_dG9sZXJhbnQtcGVuZ3Vpbi0xNS5jbGVyay5hY2NvdW50cy5kZXYk"

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </ClerkProvider>,
);

