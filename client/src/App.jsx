import { useState } from 'react'
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Signup from './components/pages/signup/Signup'
import Login from './components/pages/login/Login'
import Home from './components/pages/user/Home'
import store from '../src/redux/store'
import Dashboard from './components/pages/admin/dashboard';


function App() {
  

  return (
    <Provider store={store}>
     <BrowserRouter>

     <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/admin/dashboard' element={<Dashboard/>}/>

     </Routes>
     
     </BrowserRouter>
    </Provider>
  )
}

export default App
