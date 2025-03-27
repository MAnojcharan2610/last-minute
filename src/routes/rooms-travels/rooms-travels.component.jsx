import './rooms-travels.styles.scss'
import RoomImage from '../../assets/rooms.jpg'
import BusesImage from '../../assets/buses.jpg';
import { useNavigate } from 'react-router-dom';

const images=[RoomImage,BusesImage]
const names=["Hotel rooms","Bus travels"]
const routeNames=['rooms','travels']

const RoomsTravels = () => {
    const router = useNavigate();
    return ( 
        <div className='rooms-travels-div'>
            {names.map((name,index)=>{
                return <div key={`rooms-travels-${index}`} className='tile' onClick={()=>router(`${routeNames[index]}`)}>
                    <div className='img-div'>
                        <img src={images[index]} />
                    </div>
                    <p>{name}</p>
                </div>
            })}
        </div>
     );
}
 
export default RoomsTravels;