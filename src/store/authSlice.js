import { createSlice } from "@reduxjs/toolkit";

// const getUserData = () => {
//     try {
//         const storedData = localStorage.getItem("userData");
//         if (!storedData || storedData === "undefined") return null;
//         return storedData ? JSON.parse(storedData) : null;
//     } catch (error) {
//         console.error("Error parsing userData from localStorage:", error);
//         return null;
//     }
// };

// const initialState = {
//     status: !!getUserData(),
//     userData: getUserData()
// };
const initialState={
    status:false,
    userData:{}
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData; // ✅ Store full userData correctly
            // localStorage.setItem("userData", JSON.stringify(action.payload.userData));
        },
        logout:(state,action)=>{
            state.status=false;
            state.userData=null;
            // localStorage.removeItem("userData");
        }
    }
})

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;