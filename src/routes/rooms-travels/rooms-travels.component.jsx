import './rooms-travels.styles.scss'
import RoomImage from '../../assets/rooms.jpg'
import BusesImage from '../../assets/buses.jpg';
import { useNavigate } from 'react-router-dom';

const images = [RoomImage, BusesImage]
const names = ["Hotel rooms", "Bus travels"]
const routeNames = ['rooms', 'travels']
const descriptions = [
    "Find and book comfortable hotel rooms for your stay",
    "Book your bus tickets for hassle-free travel"
]

const RoomsTravels = () => {
    const router = useNavigate();

    return ( 
        <div className='rooms-travels-div'>
            {names.map((name, index) => {
                return (
                    <div 
                        key={`rooms-travels-${index}`} 
                        className='tile' 
                        onClick={() => router(`${routeNames[index]}`)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                router(`${routeNames[index]}`)
                            }
                        }}
                    >
                        <div className='img-div'>
                            <img src={images[index]} alt={name} />
                        </div>
                        <div className='content'>
                            <p>{name}</p>
                            <span className='description'>{descriptions[index]}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
 
export default RoomsTravels;