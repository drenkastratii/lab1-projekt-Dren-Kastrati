const express = require('express');
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/room.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', verifyToken, isAdmin, createRoom);
router.put('/:id', verifyToken, isAdmin, updateRoom);
router.delete('/:id', verifyToken, isAdmin, deleteRoom);

module.exports = router;
