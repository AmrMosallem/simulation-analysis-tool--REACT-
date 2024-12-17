import { Provider } from './components/ui/provider.jsx'
import { Global, css } from '@emotion/react'


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <Provider  >
    <Global styles={css`
     /* @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600;700;800;900&display=swap'); 
      /**/ 
      @font-face { 
        font-family: 'Nunito Sans';
        src: url('./src/assets/fonts/NunitoSans.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      } 
      :root {
      --dark: #2c1d4e;
      --darker: #211638;
      --darkest: #151320;
      --primary:#ff00ff;
      --secondary:#000dff;
      --darker-grey:#111111;
      --darkest-grey:#09090b;
      overflow-y: scroll;
        
      }

      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: #111111;
      }
      ::-webkit-scrollbar-thumb {
        background: #09090b;
      }
      *{
        font-family: "Nunito Sans", serif;
         }`} />
    <App />
  </Provider>
)
