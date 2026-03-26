import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Hotel, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl hover:text-indigo-700 transition-colors">
                        <Hotel size={28} />
                        <span>Prishitna Booking</span>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Rooms</Link>
                        {user ? (
                            <>
                                {user.role === 'Admin' && (
                                    <Link to="/admin" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                                <Link to="/my-bookings" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">My Bookings</Link>
                                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <div className="bg-indigo-100 p-1 rounded-full text-indigo-600">
                                            <User size={16} />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">{user.username}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                                <Link 
                                    to="/register" 
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
