import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    LayoutDashboard, 
    Bed, 
    CalendarCheck, 
    Plus, 
    MoreVertical, 
    Trash2, 
    Edit, 
    Check, 
    X, 
    Users, 
    DollarSign,
    TrendingUp,
    RefreshCcw,
    Image as ImageIcon
} from 'lucide-react';

const AdminDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [view, setView] = useState('bookings'); // 'rooms' or 'bookings'
    const [loading, setLoading] = useState(true);

    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', type: 'Double', price: '', description: '', image_url: '', status: 'Available' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [roomsRes, bookingsRes] = await Promise.all([
                api.get('/rooms'),
                api.get('/bookings/all')
            ]);
            setRooms(roomsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            fetchData();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('/rooms', newRoom);
            setIsAddRoomModalOpen(false);
            setNewRoom({ name: '', type: 'Double', price: '', description: '', image_url: '', status: 'Available' });
            fetchData();
        } catch (error) {
            alert('Failed to add room');
        }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchData();
        } catch (error) {
            alert('Failed to delete room');
        }
    };

    const stats = [
        { label: 'Total Revenue', value: `$${bookings.filter(b => b.status === 'Confirmed').reduce((acc, b) => acc + Number(b.total_price), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Rooms', value: rooms.length, icon: Bed, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Management Portal v1.0</p>
                    </div>
                </div>
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setView('bookings')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${view === 'bookings' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Bookings
                    </button>
                    <button 
                        onClick={() => setView('rooms')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${view === 'rooms' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Rooms
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`${stat.bg} p-4 rounded-2xl ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* View Content */}
            {view === 'bookings' ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <CalendarCheck className="text-indigo-600" />
                            Recent Bookings
                        </h3>
                        <button onClick={fetchData} className="text-indigo-600 hover:rotate-180 transition-transform duration-500 p-2">
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Guest</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Room</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Dates</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-xl text-gray-500 group-hover:bg-white transition-colors">
                                                    <Users size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{booking.User?.username}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{booking.User?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-gray-900">{booking.Room?.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{booking.Room?.type}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-gray-400">IN: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                                                <p className="text-xs font-bold text-gray-400">OUT: {new Date(booking.check_out_date).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-lg font-black text-indigo-600">${booking.total_price}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                                                booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                booking.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                {booking.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'Confirmed')}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                            title="Confirm"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(booking.id, 'Cancelled')}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <Bed className="text-indigo-600" />
                            Inventory Management
                        </h3>
                        <button 
                            onClick={() => setIsAddRoomModalOpen(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            <Plus size={20} />
                            Create New Room
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-indigo-600 font-black text-sm">
                                        ${room.price}/nt
                                    </div>
                                    <div className="absolute top-4 left-4 bg-gray-900/40 backdrop-blur px-3 py-1 rounded-full text-white font-bold text-xs uppercase">
                                        {room.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-black text-gray-900 text-lg mb-1">{room.name}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{room.type} Suite</p>
                                    <div className="flex gap-2 border-t border-gray-50 pt-4 mt-4">
                                        <button className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRoom(room.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Room Modal (Simplified) */}
            {isAddRoomModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Add New Room</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Populate Inventory</p>
                            </div>
                            <button onClick={() => setIsAddRoomModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddRoom} className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 ml-1">Room Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-gray-900" 
                                        placeholder="e.g. Master Garden Suite"
                                        required 
                                        value={newRoom.name} 
                                        onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 ml-1">Type</label>
                                    <select 
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-gray-900 appearance-none"
                                        value={newRoom.type} 
                                        onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                                    >
                                        <option>Single</option>
                                        <option>Double</option>
                                        <option>Suite</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 ml-1">Price / Night ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl pl-10 pr-5 py-3.5 outline-none transition-all font-bold text-gray-900" 
                                            placeholder="120"
                                            required 
                                            value={newRoom.price} 
                                            onChange={(e) => setNewRoom({...newRoom, price: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 ml-1">Image URL</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><ImageIcon size={18} /></span>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl pl-12 pr-5 py-3.5 outline-none transition-all font-bold text-gray-900" 
                                            placeholder="https://images.unsplash.com/..."
                                            value={newRoom.image_url} 
                                            onChange={(e) => setNewRoom({...newRoom, image_url: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 ml-1">Description</label>
                                <textarea 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3.5 outline-none transition-all font-bold text-gray-900 min-h-[120px]" 
                                    placeholder="Enter detailed room description..."
                                    value={newRoom.description} 
                                    onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={24} />
                                Register Room in System
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
