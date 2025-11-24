import React from 'react'
import { Outlet } from 'react-router'
import Navigation from './Navigation'
const ProtectedRoute = () => {
    const isAuth = true;

    //Később: Itt kérdezzük le a hitelesítési állapotot 
    // - Bejelentkezett vagy nem

    if(!isAuth){
        return <h1>Access Denied. Please login to continue.</h1>
    }    
  return (
    <div>
        <div>
             <Navigation />
        </div>
        {/* A beágyazott útvonalak megjelenítése */}
        <Outlet />
    </div>
  )
}

export default ProtectedRoute