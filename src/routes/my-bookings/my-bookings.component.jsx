import { useState, useEffect } from 'react';
// import { ref, query, orderByKey, limitToFirst, get, startAfter } from 'firebase/database';
import { useUserContext } from '../../contexts/user.context';
import { realtimeDb } from '../../utils/firebase';
import './my-bookings.styles.scss';
import { onValue, ref } from 'firebase/database';

const bookingTypes=['All Bookings','Hotel Bookings','Travel Bookings'];

const MyBookings = () => {
    const [bookingType,setBookingType]=useState('All Bookings');
    const {user}=useUserContext();
    const [filteredData,setFilteredData]=useState([]);
    const [state,setState]=useState('loading'); //loading,empty,error
    const [data,setData]=useState([]);

    useEffect(()=>{
        if(bookingType === "Hotel Bookings"){
            const newData= data.filter(d=>d.facilityType==='room')
            setFilteredData(newData)
        }else if(bookingType === "Travel Bookings"){
            const newData= data.filter(d=>d.facilityType==='travel')
            setFilteredData(newData)
        }else{
            setFilteredData(data)
        }
    },[bookingType,data])

    useEffect(()=>{
        try{
            const bookingReference = ref(realtimeDb,`userBookings/${user.uid}`);
            onValue(bookingReference,(snapshot)=>{
                if(!snapshot.exists()){
                    setState('empty')
                }else{
                    const bookingData = snapshot.val()
                    const fillData = Object.entries(bookingData).map(([key,{bookedDate,bookedMail,bookedName,noOfPassengers,bookedMobile,bookingCost,bookingName,bookingInfo,bookingId,facilityType}])=>({key,bookedDate,bookedMail,bookedName,noOfPassengers,bookedMobile,bookingCost,bookingName,bookingInfo,bookingId,facilityType}))
                    setData(fillData)
                    setState('')
                }
            })
        }catch(e){
            console.error(e)
            setState('error')
        }
    },[])

    if(state==='loading'){
        return <div className='overlaying'>Loading Your Bookings...</div>
    }
    if(state === 'empty'){
        return <div className='overlaying'>No Bookings Yet</div>
    }
    if(state === 'error'){
        return <div className='overlaying'>Error occured! Try again later.</div>
    }

        return(
            <div className='my-bookings-div'>
                <div className='booking-type'>
                    {bookingTypes.map((type,index)=>{
                        return <div key={`booking-type-${index}`} className={`tile ${bookingType === type && "blue"}`} onClick={()=>setBookingType(type)}>{type}</div>
                    })}
                </div>
                <div className='bookings-container'>
                    {filteredData.map((obj,index)=>{
                        return <div key={`book-tile-${index}`} className='book-tile'>
                            <div className='head'>
                                <p>{obj.facilityType === 'room' ? 'Hotel' :'Bus'}</p>
                                <span>ID: {obj.bookingId}</span>
                            </div>
                            <div className='name'>
                                <h3>{obj.bookingName.split('!')[0].length ? obj.bookingName.split('!')[0] : 'no name'}</h3>
                                <span>{obj.bookingName.split('!')[1]}</span>
                            </div>
                            <div className='details'>
                                <div className='ind'>
                                    <span>Date:</span>
                                    <p>{obj.bookedDate}</p>
                                </div>
                                <div className='ind'>
                                    <span>{obj.facilityType === 'room' ? 'Checckout Time:':'Travel Time:'}</span>
                                    <p>{obj.bookingInfo.split('$')[0]}</p>
                                </div>
                                <div className='ind'>
                                    <span>Location:</span>
                                    <p>{obj.bookingInfo.split('$')[3]}</p>
                                </div>
                                <div className='ind'>
                                    <span>Contact:</span>
                                    <p>empty</p>
                                </div>
                                <div className='ind'>
                                    <span>{obj.facilityType === 'room' ? 'People:':'Passengers:'}</span>
                                    <p>{obj.noOfPassengers}</p>
                                </div>
                                <div className='ind'>
                                    <span>AC Available:</span>
                                    <p>{obj.bookingInfo.split('$')[2]}</p>
                                </div>
                            </div>
                            <div className='separator'></div>
                            <div className='foot'>
                                <div className='cost'>₹ 
                                     {obj.facilityType === 'room' ? obj.bookingCost : `${Number(obj.noOfPassengers)*Number(obj.bookingCost.slice(0,obj.bookingCost.length-2))}rs`}
                                </div>
                                <div className='info'>
                                    <span>{obj.bookedName}</span>
                                    <span>{obj.bookedMobile}</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        )
};

export default MyBookings;