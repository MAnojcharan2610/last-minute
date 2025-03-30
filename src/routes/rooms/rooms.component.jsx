import './rooms.styles.scss'
import { roomsObject } from '../../utils/helpers';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdPeople, MdAcUnit, MdAccessTime } from 'react-icons/md';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const roomLocations = ["hyderabad", "chennai", "banglore"]

const Rooms = () => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const filteredRooms = selectedLocation 
        ? roomsObject.filter(room => room.location.toLowerCase() === selectedLocation.toLowerCase())
        : [];

    useEffect(() => {
        if (selectedLocation) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [selectedLocation]);

    const handleRoomSelect = (room) => {
        navigate('/booking', { state: { room } });
    };

    return ( 
        <div className="rooms-selection-container">
            <div className="location-selector">
                <h2>Select Location</h2>
                <p className="subtitle">Choose your preferred city to view available rooms</p>
                <div className="location-buttons">
                    {roomLocations.map(location => (
                        <button 
                            key={location}
                            className={`location-btn ${selectedLocation === location ? 'active' : ''}`}
                            onClick={() => setSelectedLocation(location)}
                            aria-label={`Select ${location} location`}
                        >
                            <MdLocationOn className="location-icon" />
                            {location.charAt(0).toUpperCase() + location.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {selectedLocation && (
                <div className="rooms-grid">
                    <div className="rooms-header">
                        <h3>Available Rooms in {selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)}</h3>
                        <p className="room-count">{filteredRooms.length} rooms found</p>
                    </div>
                    
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading rooms...</p>
                        </div>
                    ) : (
                        <div className="rooms-container">
                            {filteredRooms.map((room, index) => (
                                <div 
                                    key={index} 
                                    className="room-card"
                                    onClick={() => handleRoomSelect(room)}
                                >
                                    <div className="room-image-container">
                                        <img 
                                            src={room.roomImg} 
                                            alt={`Room ${room.roomName} at ${room.hotelName}`} 
                                            className="room-image" 
                                        />
                                        <div className="room-overlay">
                                            <span className="book-now">Book Now</span>
                                        </div>
                                    </div>
                                    <div className="room-details">
                                        <div className="room-header">
                                            <h4>{room.hotelName}</h4>
                                            <span className="room-number">Room {room.roomName}</span>
                                        </div>
                                        <div className="room-info">
                                            <div className="info-item">
                                                <MdPeople className="info-icon" />
                                                <p><strong>Capacity:</strong> {room.roomCapacity} persons</p>
                                            </div>
                                            <div className="info-item">
                                                <MdAcUnit className="info-icon" />
                                                <p><strong>AC:</strong> {room.isAcAvailable.toUpperCase()}</p>
                                            </div>
                                            <div className="info-item">
                                                <FaIndianRupeeSign className="info-icon" />
                                                <p><strong>Cost:</strong> {room.roomCost}</p>
                                            </div>
                                            <div className="info-item">
                                                <MdAccessTime className="info-icon" />
                                                <p><strong>Checkout:</strong> {room.checkoutTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
 
export default Rooms;