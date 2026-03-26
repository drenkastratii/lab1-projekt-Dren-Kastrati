import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, Tag, CheckCircle, Clock, XCircle, ChevronRight, Hash } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/my');
                setBookings(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return <CheckCircle size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Reservations</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and track your upcoming stays at Royal Stay.</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-indigo-100">
                    <Hash size={18} className="text-indigo-600" />
                    <span className="text-indigo-900 font-bold">{bookings.length} Total Bookings</span>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={40} className="text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h2>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Explore our premium rooms and make your first reservation today.</p>
                    <a href="/" className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Browse Rooms</a>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-64 h-48 md:h-auto overflow-hidden relative">
                                    <img src={booking.Room.image_url} alt={booking.Room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status}
                                    </div>
                                </div>
                                
                                <div className="flex-1 p-8">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">{booking.Room.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium italic">
                                                <Tag size={14} />
                                                {booking.Room.type} Luxury Suite
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Total Price Paid</p>
                                            <p className="text-xl font-black text-indigo-600">${booking.total_price}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-t border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check-In</p>
                                                <p className="text-gray-900 font-bold text-lg">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check-Out</p>
                                                <p className="text-gray-900 font-bold text-lg">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                            Details & Contact Hotel
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
