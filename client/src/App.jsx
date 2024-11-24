import { useState } from 'react'

import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Signup from './components/pages/signup/Signup'
import Login from './components/pages/login/Login'
import Home from './components/pages/user/Home'



function App() {
  

  return (
    <>
     <BrowserRouter>

     <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<Home/>}/>

     </Routes>
     
     </BrowserRouter>
    </>
  )
}

export default App
