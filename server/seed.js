const sequelize = require('./config/db');
const Room = require('./models/Room');

const seedRooms = async () => {
    try {
        await sequelize.sync({ force: true });
        
        await Room.bulkCreate([
            {
                name: 'Deluxe Ocean View',
                type: 'Suite',
                price: 250.00,
                description: 'A beautiful suite with a stunning view of the ocean.',
                image_url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
                status: 'Available'
            },
            {
                name: 'Standard City Room',
                type: 'Double',
                price: 120.00,
                description: 'Comfortable room in the heart of the city.',
                image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
                status: 'Available'
            },
            {
                name: 'Cozy Single',
                type: 'Single',
                price: 80.00,
                description: 'Perfect for solo travelers.',
                image_url: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
                status: 'Available'
            },
            {
                name: 'Presidential Suite',
                type: 'Suite',
                price: 500.00,
                description: 'Ultimate luxury with all amenities included.',
                image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
                status: 'Available'
            }
        ]);

        console.log('Database seeded with rooms!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedRooms();
