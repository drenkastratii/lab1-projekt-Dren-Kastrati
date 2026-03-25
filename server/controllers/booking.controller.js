const Booking = require('../models/Booking');
const Room = require('../models/Room');

const createBooking = async (req, res) => {
    try {
        const { roomId, check_in_date, check_out_date, total_price } = req.body;
        const userId = req.user.id; // From verifyToken middleware

        // Check if room is available
        const room = await Room.findByPk(roomId);
        if (!room || room.status !== 'Available') {
            return res.status(400).json({ message: 'Room is not available' });
        }

        const booking = await Booking.create({
            userId,
            roomId,
            check_in_date,
            check_out_date,
            total_price
        });

        // Optional: Mark room as booked (or wait for confirmation)
        // await room.update({ status: 'Booked' });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({ 
            where: { userId: req.user.id },
            include: [Room]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({ include: [Room, 'User'] });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        await booking.update({ status: req.body.status });
        
        // If confirmed, mark room as booked
        if (req.body.status === 'Confirmed') {
            const room = await Room.findByPk(booking.roomId);
            await room.update({ status: 'Booked' });
        } else if (req.body.status === 'Cancelled') {
            const room = await Room.findByPk(booking.roomId);
            await room.update({ status: 'Available' });
        }

        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
