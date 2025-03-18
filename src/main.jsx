import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PostCard from './components/PostCard.jsx'
import Protected from './components/AuthLayout.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import AllPost from './pages/AllPost.jsx'
import AddPost from './pages/AddPost.jsx'
import EditPost from './pages/EditPost.jsx'
import Post from './pages/Post.jsx'
import { RouterProvider } from 'react-router-dom'
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Protected authentication={false}><Login/></Protected>} ></Route>
      <Route path='/signup' element={<Protected authentication={false}><Signup/></Protected>} ></Route>
      <Route path='/all-posts' element={<Protected authentication={true}><AllPost/></Protected>} ></Route>
      <Route path='/add-post' element={<Protected authentication={true}><AddPost/></Protected>} ></Route>
      <Route path='/edit-post/:slug' element={<Protected authentication={true}><EditPost/></Protected>} ></Route>
      <Route path='/post/:slug' element={<Protected authentication={true}><Post/></Protected>} ></Route>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
      <RouterProvider router={router} /> {/* ✅ Using RouterProvider correctly */}
    </Provider>
  </StrictMode>,
)
