import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './theme.js'
import { ConfirmProvider } from "material-ui-confirm";

//config toastify
import { ToastContainer } from 'react-toastify';
import {Provider} from 'react-redux';
import {store} from '~/redux/store';
import { BrowserRouter } from 'react-router-dom';

import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { injectStore } from '~/utils/authorizedAxios';

injectStore(store)

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(

  
  <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogProps: {
            closeAfterTransition: false,
          }
        }}>
        <CssBaseline />
        <App />

        <ToastContainer />
        </ConfirmProvider>
        </CssVarsProvider>
    </BrowserRouter>
      </PersistGate>
    </Provider>


  
)
