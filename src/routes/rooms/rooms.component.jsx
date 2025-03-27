import './rooms.styles.scss'
import { roomsObject } from '../../utils/helpers';
import { useState } from 'react';

const roomLocations =["hyderabad","chennai","banglore"]

const Rooms = () => {

    const [selectedLocation, setSelectedLocation] = useState('');

    const filteredRooms = selectedLocation 
    ? roomsObject.filter(room => room.location.toLowerCase() === selectedLocation.toLowerCase())
    : [];

    return ( 
        <div className="rooms-selection-container">
      <div className="location-selector">
        <h2>Select Location</h2>
        <div className="location-buttons">
          {roomLocations.map(location => (
            <button 
              key={location}
              className={`location-btn ${selectedLocation === location ? 'active' : ''}`}
              onClick={() => setSelectedLocation(location)}
            >
              {location.charAt(0).toUpperCase() + location.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <div className="rooms-grid">
          <h3>Available Rooms in {selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)}</h3>
          <div className="rooms-container">
            {filteredRooms.map((room, index) => (
              <div key={index} className="room-card">
                <img src={room.roomImg} alt={`Room ${room.roomName}`} className="room-image" />
                <div className="room-details">
                  <h4>{room.hotelName} - Room {room.roomName}</h4>
                  <div className="room-info">
                    <p><strong>Capacity:</strong> {room.roomCapacity} persons</p>
                    <p><strong>AC:</strong> {room.isAcAvailable.toUpperCase()}</p>
                    <p><strong>Cost:</strong> {room.roomCost}</p>
                    <p><strong>Checkout:</strong> {room.checkoutTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
     );
}
 
export default Rooms;