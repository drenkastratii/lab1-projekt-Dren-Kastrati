import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [booked, setBooked] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await api.get(`/rooms/${id}`);
                setRoom(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        
        setBookingLoading(true);
        try {
            const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
            const total = days * room.price;
            
            await api.post('/bookings', {
                roomId: room.id,
                check_in_date: checkIn,
                check_out_date: checkOut,
                total_price: total
            });
            setBooked(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (booked) return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-green-100 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-green-500"></div>
                <div className="mb-6 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full text-green-600">
                        <CheckCircle2 size={64} />
                    </div>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Requested!</h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">Your booking request for <span className="font-bold text-indigo-600">{room.name}</span> has been submitted. Our team will review it shortly.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => navigate('/my-bookings')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">View My Bookings</button>
                    <button onClick={() => navigate('/')} className="bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200">Back to Home</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 font-bold transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Explorer
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                    <img src={room.image_url} alt={room.name} className="w-full h-[500px] object-cover" />
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">{room.type}</span>
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{room.name}</h1>
                            </div>
                            <div className="text-right font-bold text-gray-900">
                                <span className="text-3xl text-indigo-600">${room.price}</span>
                                <span className="text-gray-400 text-sm"> / night</span>
                            </div>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">{room.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 py-8 border-t border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-50 p-2.5 rounded-xl text-indigo-500">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Guarantee</p>
                                    <p className="text-sm font-bold text-gray-700 italic">Best Price</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-50 p-2.5 rounded-xl text-indigo-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Flexibility</p>
                                    <p className="text-sm font-bold text-gray-700 italic">Easy Cancel</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-indigo-50 pointer-events-none">
                            <CreditCard size={120} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 relative">
                            <Calendar className="text-indigo-600" />
                            Book Your Stay
                        </h3>
                        <form onSubmit={handleBooking} className="space-y-6 relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Check-in Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Check-out Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={bookingLoading}
                                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-70 flex justify-center items-center gap-2 group"
                            >
                                {bookingLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        Confirm Booking Request
                                        <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 font-medium tracking-wide">You won't be charged yet. We'll verify availability first.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
