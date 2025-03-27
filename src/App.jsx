import { Routes,Route } from "react-router-dom"
import Navbar from "./components/navbar/navbar.component"
import Login from "./routes/login/login.component"
import { useUserContext } from "./contexts/user.context"
import RoomsTravels from "./routes/rooms-travels/rooms-travels.component"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./utils/firebase"
import Rooms from "./routes/rooms/rooms.component"
import Travels from "./routes/travels/travels.component"
import '@fontsource/lora'

function App() {
  const {user,handleSetUser}=useUserContext();
  // console.log(user)
  // useEffect(() => {
  //   const checkAuthState = async () => {
  //     const unsubscribe = onAuthStateChanged(auth, (user) => {
  //       if(user){
  //         handleSetUser(user);
  //         // setIsLoading(false);
  //       }else{
  //         // setIsLoading(false);
  //         handleSetUser(null);
  //       }
  //     });
  //     return () => unsubscribe();
  //   };
  //   // setIsLoading(true);
  //   checkAuthState();      
  // }, [handleSetUser]);

  if(user){
    return <Login/>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar/>}>
          <Route index  element={<RoomsTravels/>} />
          <Route path="rooms" element={<Rooms/>} />
          <Route path="travels" element={<Travels/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
