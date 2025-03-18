import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default  function Protected({children,authentication=true}) {
    const navigate=useNavigate()
    const [loader,setLoader]=useState(true)
    const authStatus=useSelector((state)=>state.auth.status)
    useEffect(()=>{
        if(authentication && authStatus!==authentication){
            navigate("/login")
        }
        else if(!authentication && authStatus!==authentication){
            navigate('/')
        }
        setLoader(false)
    },[authStatus,navigate,authentication])

  return loader ? <h1>Loading....</h1> : children
}
// I get it—this logic can be tricky. Let me simplify it for you.

// Think of authStatus as "Is the user logged in?" (true/false).
// Think of authentication as "Should the user be logged in to access this page?" (true/false).

// Now, in useEffect:

// If the page requires login (authentication === true) but the user is NOT logged in (authStatus !== true), they get redirected to /login.
// If the page should NOT be accessed by logged-in users (authentication === false), but the user IS logged in (authStatus !== false), they get redirected to / (home page).
// The purpose? To protect pages—making sure only the right users can access them.


// You said:
// so it is like for eg our website has 10 pages then authentication will tell that u have to or not logged in to see the content of that page and then with the help of authstatus we will check if user is logged in or not if page req authentication means authentication =true but user is not loggedin means authtatus=false then redirect('/login') if page doesnt require authentication  then ....

// ChatGPT said:

// Exactly! 🔥

// For a website with 10 pages:

// authentication (true/false) tells whether login is required for a page.
// authStatus (true/false) tells if the user is actually logged in.
// Now, the logic:

// If authentication === true (page requires login) but authStatus === false (user is NOT logged in) → Redirect to /login.
// If authentication === false (page should NOT be accessed by logged-in users) but authStatus === true (user IS logged in) → Redirect to / (home).
// This way,
// ✅ Protected pages stay protected.
// ✅ Guest-only pages (like login/signup) stay for guests.

