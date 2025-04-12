import './booking.styles.scss';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDirectionsBus, MdAcUnit, MdAccessTime, MdRoute, MdPeople, MdLocationOn} from 'react-icons/md';
import {  FaRegCalendarAlt, FaUserAlt, FaPhoneAlt, FaEnvelope, FaCheck, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
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
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});
    const [cardErrors, setCardErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);

  
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

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
        }
        
       
        if (name === 'expiry') {
            formattedValue = value.replace(/\//g, '');
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        }
        
       
        if (name === 'cvv') {
            formattedValue = value.slice(0, 4);
        }

        setCardDetails(prev => ({
            ...prev,
            [name]: formattedValue
        }));
        
     
        if (cardErrors[name]) {
            setCardErrors(prev => ({
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

    const validateCardDetails = () => {
        const newErrors = {};
        
        if (!cardDetails.cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required';
        } else if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Card number must be at least 16 digits';
        }
        
        if (!cardDetails.cardName.trim()) {
            newErrors.cardName = 'Name on card is required';
        }
        
        if (!cardDetails.expiry.trim()) {
            newErrors.expiry = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
            newErrors.expiry = 'Expiry date format should be MM/YY';
        }
        
        if (!cardDetails.cvv.trim()) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
            newErrors.cvv = 'CVV must be 3 or 4 digits';
        }
        
        setCardErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setShowPaymentForm(true);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        if (validateCardDetails()) {
            setIsSubmitting(true);
            
            // Simulate payment processing
            setTimeout(async () => {
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
                    bookingId:generatedBookingId,
                    facilityType:room ? 'room' : 'travel'
                }
                try{
                    const bookingsRef = ref(realtimeDb,`userBookings/${user.uid}`)
                    await push(bookingsRef,bookingObject)
                    setBookingId(generatedBookingId)
                    setBookingConfirmed(true)
                    setIsSubmitting(false)
                }catch(e){
                    alert('unable to book try again later')
                    console.error(e)
                }
            }, 1500);
        }
    };

    const handleNewBooking = () => {
        navigate('/');
    };

    // Determine card type based on first digits
    const getCardType = (number) => {
        const firstDigit = number.charAt(0);
        const firstTwoDigits = number.substring(0, 2);
        
        if (firstDigit === '4') return 'visa';
        if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return 'mastercard';
        if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'amex';
        if (firstDigit === '6') return 'discover';
        return 'generic';
    };

    const cardType = getCardType(cardDetails.cardNumber.replace(/\s/g, ''));

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

    if (showPaymentForm) {
        return (
            <div className="payment-container">
                <div className="payment-form-wrapper">
                    <h2>Payment Details</h2>
                    
                    <div className="payment-summary">
                        <h3>Booking Summary</h3>
                        <p>{room ? room.hotelName : travel.busName} {travel && `(Bus ${travel.busNo})`}</p>
                        <p>Date: {new Date(bookingDetails.date).toLocaleDateString()}</p>
                        <p>{room ? 'Guests' : 'Passengers'}: {bookingDetails.passengers}</p>
                        <p className="total-amount">
                            Total Amount: ₹{room ? room.roomCost : (Number(travel.busCost.slice(0,travel.busCost.length-2)) * Number(bookingDetails.passengers))}
                        </p>
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit} className="payment-form">
                        <div className="form-group">
                            <label>
                                <FaCreditCard /> Card Number
                                {cardType !== 'generic' && (
                                    <span className={`card-type ${cardType}`}>
                                        {cardType.toUpperCase()}
                                    </span>
                                )}
                            </label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardInputChange}
                                placeholder="•••• •••• •••• ••••"
                                className={`card-input ${cardErrors.cardNumber ? 'error' : ''} ${cardType}`}
                                maxLength="19"
                            />
                            {cardErrors.cardNumber && <span className="error-message">{cardErrors.cardNumber}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label>Name on Card</label>
                            <input
                                type="text"
                                name="cardName"
                                value={cardDetails.cardName}
                                onChange={handleCardInputChange}
                                placeholder="JOHN DOE"
                                className={cardErrors.cardName ? 'error' : ''}
                            />
                            {cardErrors.cardName && <span className="error-message">{cardErrors.cardName}</span>}
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    value={cardDetails.expiry}
                                    onChange={handleCardInputChange}
                                    placeholder="MM/YY"
                                    className={cardErrors.expiry ? 'error' : ''}
                                    maxLength="5"
                                />
                                {cardErrors.expiry && <span className="error-message">{cardErrors.expiry}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardInputChange}
                                    placeholder="•••"
                                    className={cardErrors.cvv ? 'error' : ''}
                                    maxLength="4"
                                />
                                {cardErrors.cvv && <span className="error-message">{cardErrors.cvv}</span>}
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="process-payment-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Processing Payment...
                                </>
                            ) : (
                                <>Pay ₹{room ? room.roomCost : (Number(travel.busCost.slice(0,travel.busCost.length-2)) * Number(bookingDetails.passengers))}</>
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            className="back-btn"
                            onClick={() => setShowPaymentForm(false)}
                            disabled={isSubmitting}
                        >
                            Back to Booking Details
                        </button>
                    </form>
                    
                    <div className="secure-payment-info">
                        <p>🔒 Secure payment processing. Your card details are protected.</p>
                    </div>
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
                                    <span>₹{travel.busCost.slice(0,travel.busCost.length-2) * bookingDetails.passengers}</span>
                                </div>
                            )}
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>₹{room ? room.roomCost : (Number(travel.busCost.slice(0,travel.busCost.length-2)) * Number(bookingDetails.passengers))}</span>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-booking-btn"
                        >
                            Proceed to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Booking;