import { Routes,Route } from "react-router-dom"
import Navbar from "./components/navbar/navbar.component"
import Login from "./routes/login/login.component"
import { useUserContext } from "./contexts/user.context"
import RoomsTravels from "./routes/rooms-travels/rooms-travels.component"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./utils/firebase"
import Rooms from "./routes/rooms/rooms.component"
import Travels from "./routes/travels/travels.component"
import User from './routes/user/user.component'
import Booking from "./routes/booking/booking.component"
import MyBookings from "./routes/my-bookings/my-bookings.component"
import LoadingIcon from './assets/hotel-2-svgrepo-com.svg';

function App() {
  const {user,handleSetUser}=useUserContext();
  const [isLoading,setIsLoading]=useState(true);
  // console.log(user)
  useEffect(() => {
    const checkAuthState = async () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user){
          handleSetUser(user);
          setIsLoading(false);
        }else{
          setIsLoading(false);
          handleSetUser(null);
        }
      });
      return () => unsubscribe();
    };
    setIsLoading(true);
    checkAuthState();      
  }, [handleSetUser]);

  if(isLoading){
    return <div className="overlaying initial-icon">
        <img src={LoadingIcon} width={"100px"} />
        <span>Loading...</span>
    </div>
  }

  if(!user){
    return <Login/>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar/>}>
          <Route index  element={<RoomsTravels/>} />
          <Route path="rooms" element={<Rooms/>} />
          <Route path="travels" element={<Travels/>} />
          <Route path="user" element={<User/>} />
          <Route path="booking" element={<Booking/>} />
          <Route path="my-bookings" element={<MyBookings/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
