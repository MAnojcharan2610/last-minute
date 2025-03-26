import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children})=>{

    const [user,setUser]=useState(null);
    const handleSetUser=(val)=>setUser(val)

    return(
        <UserContext.Provider value={{user,handleSetUser}}>
            {children}
        </UserContext.Provider>
    )
}
export const useUserContext = ()=>useContext(UserContext);