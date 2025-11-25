import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router";
import Home from './pages/Home';

import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import VoteDetails from './pages/VoteDetails';






function App() {

  return (
   <>
  <Routes>
    <Route element={<ProtectedRoute />}>
     <Route index element={<Home />} />
     <Route path='vote'>
     <Route path=':id' element={<VoteDetails />} />
    </Route>
    </Route>
    
  </Routes>
   </>
  )
}

export default App
