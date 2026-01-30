import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './store/store'
import './index.css'
import Navbar from './components/Navbar'

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <Navbar />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
