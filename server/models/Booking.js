const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Room = require('./Room');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    check_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    check_out_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending'
    }
});

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = Booking;
