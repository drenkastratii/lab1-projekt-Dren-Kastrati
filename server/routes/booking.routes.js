const express = require('express');
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/booking.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.get('/all', verifyToken, isAdmin, getAllBookings);
router.put('/:id/status', verifyToken, isAdmin, updateBookingStatus);

module.exports = router;
