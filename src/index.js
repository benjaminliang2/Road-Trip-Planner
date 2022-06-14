// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
//the new react createRoot causes weird behavior with Google Maps. Eg: the old routes will still be shown even when a new route is calculated. 

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import store from './redux/configureStore'
import { CookiesProvider } from 'react-cookie'



ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>

      <Provider store={store}>
        <App />
      </Provider>

    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);



