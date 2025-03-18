import React ,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {Button,Logo,Input} from './index'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/Auth'
import { login } from '../store/authSlice'

// read below writed documentation
function Signup() {
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const {register,handleSubmit}=useForm()
   const [error,setError]=useState("")

    const signup=async(data)=>{
        setError("")
        try {
            const user=await authService.createAcc(data)
            if(user){
                const userData= await authService.getCurrentUser()
                if(userData){
                    dispatch(login(userData))
                    navigate("/")
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className="flex items-center justify-center">
     <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
            <span className="inline-block w-full max-w-[100px]">
                <Logo width="100%"/>
            </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
        <p  className="mt-2 text-center text-base text-black/60">
        Already have an account?&nbsp;
            <Link to='/login' className="font-medium text-primary transition-all duration-200 hover:underline">
            Log in</Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(signup)}>
        <div className='space-y-5'>
            <Input label='name' type='text' placeholder='Enter Name....' {...register("name",{required:true})} />
            <Input
        label="email" type="email" placeholder="Enter Email..." {...register("email", {required: true,
               validate: {
                matchPattern: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
    },
  })}
/>
            <Input label='password' type='password' placeholder='Enter Password...' {...register("password",{required:true})}/>
            <Button type='submit' className="w-full">Create Account</Button>
            </div>
        </form>
        </div> 
    </div>
  )
}

export default Signup

// useForm provides two functionalities: `register` and `handleSubmit`.
//
// 1. `register`:
//    - It connects input fields to React Hook Form's state management.
//    - It takes the input name as an argument and returns necessary props to be spread into the input fields.
//    - Example: `{...register("name")}` links the input to form data.

// It means that when you use register, React Hook Form internally keeps track of the input’s value, changes, and validation without you needing to manage it manually.

// How?
// When you use:

// <input {...register("email")} />

// React Hook Form automatically:

// Tracks the value – When you type, React Hook Form updates the value in its internal state.
// Handles onChange – You don’t need to manually set onChange; it updates automatically.
// Manages re-renders – React Hook Form minimizes re-renders for better performance.
// Handles validation (if defined) – It validates the field based on the rules you set.

// 2. `handleSubmit(onSubmit)`:
//    - It handles form submission and passes form data to the provided function (here, `signup`).
//    - When the form is submitted, it gathers all input values registered via `register` and passes them to `signup(data)`.
//
// 3. How Data is Collected:
//    - Each input field is registered using `register("fieldName")`.
//    - When the user types, React Hook Form updates its internal state.
//    - On form submission, `handleSubmit(signup)` gathers all registered inputs and passes them as an object (`data`) to the `signup` function.
//
// 4. Error Handling:
//    - If the `try` block fails in `signup`, `setError(error.message)` updates the `error` state.
//    - If `error` has a value, it is displayed in a `<p>` tag with a red color.
//
// 5. Authentication Flow:
//    - `authService.createAcc(data)` is called to create a new account with the inputted name, email, and password.
//    - If the user is successfully created, `authService.getCurrentUser()` retrieves the authenticated user's details.
//    - The user data is then stored in Redux using `dispatch(login(userData))`.
//    - Finally, `navigate("/")` redirects the user to the home page.


// so basiaclly after filling form when user clicked the btn then bcz of register all data is wrapped up in an object bcz register("input field name") contains the name of the fiels in which we are typing values and here that wrapped obj that has all the values is 'data' and then fun that take data as an argument called another fun like createAcc to actually create account or sign up and createAcc(email,name,password) takes 3 arguments check in Auth in appwrite folder which are all available in 'data' as soon we clicked the btn after filling info so here we called createAcc as createAcc(data)

// register("name") links inputs to react-hook-form.
// User types, and values are tracked.
// On submit, handleSubmit(signup) collects all values into data.
// signup(data) runs, passing data (e.g., { name, email, password }) to createAcc().
// ✔️ No manual data handling—it's auto-collected!