import React from 'react'
import { Link, NavLink } from 'react-router';

const Navigation = () => {
 const routes = [{ 
    name: 'Home',
    route: '/'
  }
 ];
 
    return (
    <div>
        <nav className='flex gap-5'>
            {routes.map((r) => (
                <NavLink to={r.route} className={({isActive}) => 
                isActive ? "text-red-500" : "text-black"
                }>
                    {r.name}
                </NavLink>

            ))}
        </nav>
    </div>
  )
}

export default Navigation