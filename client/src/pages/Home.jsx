import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Star, MapPin, Users, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Discover Your Perfect Stay</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Handpicked premium rooms for an unforgettable experience. Luxury meets comfort in every corner.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div key={room.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-64 overflow-hidden">
                            <img src={room.image_url} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-indigo-600 font-bold text-sm shadow-sm">
                                ${room.price} / night
                            </div>
                            {room.status !== 'Available' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider text-sm shadow-lg">
                                        {room.status}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{room.name}</h3>
                                <div className="flex items-center text-amber-500 gap-1">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm font-bold text-gray-700">4.9</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>
                            
                            <div className="flex items-center gap-4 text-gray-400 mb-6 py-4 border-t border-gray-50">
                                <div className="flex items-center gap-1.5" title="Guests">
                                    <Users size={16} className="text-indigo-400" />
                                    <span className="text-xs font-medium text-gray-600">2 Guests</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Wifi">
                                    <Wifi size={16} className="text-indigo-400" />
                                    <span className="text-xs font-medium text-gray-600">Free Wifi</span>
                                </div>
                                <div className="flex items-center gap-1.5" title="Location">
                                    <MapPin size={16} className="text-indigo-400" />
                                    <span className="text-xs font-medium text-gray-600">Center</span>
                                </div>
                            </div>
                            
                            <Link 
                                to={`/room/${room.id}`}
                                className="block w-full text-center bg-gray-50 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-indigo-100 hover:border-indigo-600 shadow-sm"
                            >
                                View Details & Book
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
