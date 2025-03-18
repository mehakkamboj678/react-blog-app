import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useDispatch} from'react-redux'
import { login,logout } from './store/authSlice'
import authService from './appwrite/Auth'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

// must read all the cmts


// Role of login() and logout() funs created in authSlice
// You're right that these functions are not actually logging in or out from Appwrite. The real login/logout happens through Appwrite's authentication methods (like createSession() for login and deleteSession() for logout).

// However, in this context, login() and logout() are used to update the Redux state based on whether a user is logged in or not.

// Why Are login() and logout() Used Here?
// 1️⃣ They Update the Redux Store:

// login(): Stores the user data in Redux if the user is logged in.
// logout(): Clears the user data if no user is found.
// 2️⃣ They Help Manage Authentication State in the UI:

// Instead of calling getCurrentUser() multiple times in different components, we store the user info in Redux.
// Any component that needs user data can just access it from Redux instead of making another API call.

// Think of Appwrite as a vault where user data is stored.

// getCurrentUser() = Checking inside the vault to see if the user is there.
// Redux (login() & logout()) = Keeping a small notebook in your hand that notes who is logged in.
// Instead of checking the vault every time, you check your notebook (Redux) to see who is logged in.

// Yes, exactly! The main purpose of using login() and logout() in Redux is to increase speed and efficiency by avoiding unnecessary API calls.

// How Does It Improve Speed?
// 1️⃣ Without Redux (Slow)

// Every component that needs user info would have to call getCurrentUser() separately.
// This means multiple API requests → slower performance.
function App() {
  const [loading,setLoading]=useState(true);
  const dispatch=useDispatch()
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => setLoading(false));
  }, [dispatch]);
  

//   Why Are We Setting loading = false?
// We set loading = false to update the UI after we finish checking if the user is logged in or not.

// Step-by-Step Explanation
// 1️⃣ Before fetching user data, we set loading = true

// const [loading, setLoading] = useState(true);
// This makes sure that while we are checking the user's status, we can show a loading spinner or placeholder UI instead of rendering the actual content.

// 2️⃣ After fetching user data (whether login or logout), we set loading = false

// .finally(() => setLoading(false));
// This means the authentication check is complete, and we can now display the actual UI.

return loading ? (
  <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
    Loading...
  </div>
) : (
  <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <Header />
    <main className="flex-grow container mx-auto p-4">
      TODO :<Outlet/>
      {/* <Outlet/> */}
    </main>
    <Footer />
  </div>
);
  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <h1 className="text-3xl font-bold text-blue-600">Hello, Tailwind CSS!</h1>
  //   </div>
  // );
}

export default App
// means initally as loading is true so Loading..... will be printed and useffect is executed which will upadte store acc , set loading to false and as laoding is false now all the components will gonna render 

// Summary of How Authentication Works in Your App
// 1️⃣ App Starts → loading = true (waiting for user data from Appwrite).
// 2️⃣ useEffect Runs (Only Once) → Fetches the current user.

// If a user exists → dispatch(login({ userData })).
// If no user → dispatch(logout()).
// 3️⃣ Finally, loading = false → UI updates based on Redux state.
// What Happens When a User Logs Out?
// ✔ dispatch(logout()) updates Redux (status = false, userData = null).
// ✔ React detects the change and re-renders the UI automatically.
// ✔ No need to update loading again because Redux handles state changes.

// What If a New User Logs In?
// ✔ dispatch(login({ userData })) updates Redux.
// ✔ React re-renders, showing the new user’s data.

// Key Takeaways
// ✅ useEffect() only runs once (for the initial check).
// ✅ Redux handles login/logout state changes dynamically.
// ✅ UI updates automatically based on Redux state changes.
// ✅ No need to reset loading because it’s only for the first fetch.

// Your app will always reflect the correct authentication state without needing manual refreshes. 🚀

// inspite of we write like if loading=true console.log("laoding....') else show data when we loged out and they will change status = false, userData = null. ui still gonna upadte and show something

// Yes! Even though loading is only set once during the initial fetch, the UI will still update properly when you log out.

// Why?
// Because React re-renders whenever Redux state changes, even if loading is never updated again.

// Let’s break it down
// 🔹 Initially

// js
// Copy
// Edit
// if (loading) {
//   console.log("Loading...");
// } else {
//   show data;
// }
// Since loading = true, it logs "Loading..." at first.
// Once the user data is fetched, loading = false, and the data is shown.
// When You Logout
// 🚀 Even though loading doesn’t change again, the UI still updates because:
// 1️⃣ Redux updates state → status = false, userData = null.
// 2️⃣ React detects the state change and re-renders the UI.
// 3️⃣ The UI reacts to userData = null and shows the login screen instead.

// ✔ Result? → Even if loading stays false, the UI still updates dynamically!

// So, do we need to update loading again?
// ❌ No, because loading is only for the first fetch.
// ✅ After that, Redux state changes handle everything automatically.

// Let me know if anything still feels confusing! 🚀