const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import Models to ensure they are synchronized
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync models
        await sequelize.sync({ force: false });
        console.log('Models synchronized.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

app.get('/', (req, res) => {
    res.send('Hotel Booking API is running...');
});

startServer();
