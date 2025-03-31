import './booking.styles.scss';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDirectionsBus, MdAcUnit, MdAccessTime, MdRoute, MdPeople, MdLocationOn} from 'react-icons/md';
import {  FaRegCalendarAlt, FaUserAlt, FaPhoneAlt, FaEnvelope, FaCheck, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { realtimeDb } from '../../utils/firebase';
import { useUserContext } from '../../contexts/user.context';
import { push,ref } from 'firebase/database';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { travel, room } = location.state || {};
    const {user}=useUserContext();
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        passengers: room ? 1 : 1,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState('');

    // Redirect if no travel or room data
    useEffect(() => {
        if (!travel && !room) {
            navigate('/');
        }
    }, [travel, room, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!bookingDetails.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!bookingDetails.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(bookingDetails.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!bookingDetails.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(bookingDetails.phone)) {
            newErrors.phone = 'Phone number should be 10 digits';
        }
        
        if (!bookingDetails.date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(bookingDetails.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.date = 'Date cannot be in the past';
            }
        }

        if (room && (bookingDetails.passengers < 1 || bookingDetails.passengers > room.roomCapacity)) {
            newErrors.passengers = `Guests must be between 1 and ${room.roomCapacity}`;
        }
        
        if (travel && (bookingDetails.passengers < 1)) {
            newErrors.passengers = 'At least 1 passenger is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // setIsSubmitting(true);
            const generatedBookingId = Math.random().toString(36).substring(2,10).toUpperCase()
            const bookingObject={
                bookedDate:bookingDetails.date,
                bookedMail:bookingDetails.email,
                bookedName:bookingDetails.name,
                noOfPassengers:bookingDetails.passengers,
                bookedMobile:bookingDetails.phone,
                bookingCost : room ? room.roomCost : travel.busCost,
                bookingName:room ? `${room.hotelName+"!"+room.roomName}` : `${travel.busName+"!"+travel.busNo}`,
                bookingInfo:room ? `${room.checkoutTime+'$'+room.hotelNumber+'$'+room.isAcAvailable+'$'+room.location}` : `${travel.tripTime+'$'+travel.driverNo+'$'+travel.isAcAvailable+'$'+travel.via}`,
                bookingId:generatedBookingId
            }
            // try{
            //     const bookingsRef = ref(realtimeDb,`userBookings/${user.uid}`)
            //     await push(bookingsRef,bookingObject)
            //     setBookingId(generatedBookingId)
            //     setBookingConfirmed(true)
            //     setIsSubmitting(false)
            // }catch(e){
            //     alert('unable to book try again later')
            //     console.error(e)
            // }
        }
    };

    const handleNewBooking = () => {
        navigate('/');
    };

    if (bookingConfirmed) {
        return (
            <div className="booking-confirmed">
                <div className="confirmation-container">
                    <div className="confirmation-icon">
                        <FaCheck />
                    </div>
                    <h2>Booking Confirmed!</h2>
                    <div className="booking-id">
                        Booking ID: <strong>{bookingId}</strong>
                    </div>
                    
                    <div className="confirmation-details">
                        <p>
                            <span><strong>Name:</strong></span> 
                            <span>{bookingDetails.name}</span>
                        </p>
                        <p>
                            <span><FaCalendarAlt /> <strong>Date:</strong></span> 
                            <span>{new Date(bookingDetails.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}</span>
                        </p>
                        <p>
                            <span><FaUserAlt /> <strong>{room ? 'Guests' : 'Passengers'}:</strong></span> 
                            <span>{bookingDetails.passengers}</span>
                        </p>
                        <p>
                            <span><strong>{room ? 'Room' : 'Bus'}:</strong></span> 
                            <span>{room ? room.roomName : travel.busName} {travel && `(Bus ${travel.busNo})`}</span>
                        </p>
                        <p>
                            <span><FaMapMarkerAlt /> <strong>Location:</strong></span> 
                            <span>{room ? room.location : travel.route}</span>
                        </p>
                        <p>
                            <span><FaMoneyBillWave /> <strong>Amount:</strong></span> 
                            <span>₹{room ? room.roomCost : travel.busCost * bookingDetails.passengers}</span>
                        </p>
                    </div>
                    
                    <div className="confirmation-message">
                        <FaEnvelope /> A confirmation email has been sent to <strong>{bookingDetails.email}</strong> with all the details.
                    </div>
                    
                    <button className="new-booking-btn" onClick={handleNewBooking}>
                        Make Another Booking
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-container">
            <div className="booking-grid">
                <div className="selected-item-details">
                    <h2>{room ? 'Room Details' : 'Travel Details'}</h2>
                    
                    <div className="item-image-container">
                        <img 
                            src={room ? room.roomImg : travel.busImg} 
                            alt={room ? `Room at ${room.hotelName}` : `Bus ${travel.busNo}`}
                            className="item-image"
                        />
                    </div>
                    
                    <div className="item-info">
                        <h3>{room ? room.hotelName : travel.busName}</h3>
                        <p className="item-subheader">
                            {room ? `Room ${room.roomName}` : `Bus ${travel.busNo}`}
                        </p>
                        
                        <div className="info-grid">
                            {room ? (
                                <>
                                    <div className="info-item">
                                        <MdLocationOn className="info-icon" />
                                        <p><strong>Location:</strong> {room.location}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdPeople className="info-icon" />
                                        <p><strong>Capacity:</strong> {room.roomCapacity} persons</p>
                                    </div>
                                    <div className="info-item">
                                        <MdAcUnit className="info-icon" />
                                        <p><strong>AC:</strong> {room.isAcAvailable.toUpperCase()}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdAccessTime className="info-icon" />
                                        <p><strong>Checkout:</strong> {room.checkoutTime}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="info-item">
                                        <MdLocationOn className="info-icon" />
                                        <p><strong>Route:</strong> {travel.route}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdDirectionsBus className="info-icon" />
                                        <p><strong>Bus Type:</strong> {travel.busType}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdAcUnit className="info-icon" />
                                        <p><strong>AC:</strong> {travel.isAcAvailable.toUpperCase()}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdAccessTime className="info-icon" />
                                        <p><strong>Trip Time:</strong> {travel.tripTime}</p>
                                    </div>
                                    <div className="info-item">
                                        <MdRoute className="info-icon" />
                                        <p><strong>Via:</strong> {travel.via}</p>
                                    </div>
                                </>
                            )}
                            <div className="info-item price-item">
                                <p><strong>Cost:</strong> 
                                    <span className="price">₹{room ? room.roomCost : travel.busCost}</span>
                                    {travel && <span className="per-person">/person</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="booking-form-container">
                    <h2>Complete Your Booking</h2>
                    
                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-group">
                            <label htmlFor="name">
                                <FaUserAlt className="form-icon" /> Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={bookingDetails.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope className="form-icon" /> Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={bookingDetails.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">
                                <FaPhoneAlt className="form-icon" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={bookingDetails.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your 10-digit phone number"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date">
                                    <FaRegCalendarAlt className="form-icon" /> Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={bookingDetails.date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={errors.date ? 'error' : ''}
                                />
                                {errors.date && <span className="error-message">{errors.date}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="passengers">
                                    <MdPeople className="form-icon" /> {room ? 'Guests' : 'Passengers'}
                                </label>
                                <input
                                    type="number"
                                    id="passengers"
                                    name="passengers"
                                    value={bookingDetails.passengers}
                                    onChange={handleInputChange}
                                    min="1"
                                    max={room ? room.roomCapacity : undefined}
                                    className={errors.passengers ? 'error' : ''}
                                />
                                {errors.passengers && <span className="error-message">{errors.passengers}</span>}
                            </div>
                        </div>
                        
                        <div className="price-summary">
                            <div className="summary-row">
                                <span>Base price:</span>
                                <span>₹{room ? room.roomCost : travel.busCost}</span>
                            </div>
                            {travel && bookingDetails.passengers > 1 && (
                                <div className="summary-row">
                                    <span>x {bookingDetails.passengers} passengers:</span>
                                    <span>₹{travel.busCost * bookingDetails.passengers}</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>₹{room ? room.roomCost : (travel.busCost * bookingDetails.passengers)}</span>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-booking-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Processing...
                                </>
                            ) : (
                                <>Confirm Booking</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Booking;