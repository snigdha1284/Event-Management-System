const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management');
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Users (with checks)
        const checkAndCreate = async (userData) => {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                return await User.create(userData);
            }
            return exists;
        };

        const superadmin = await User.findOne({ role: 'superadmin' });
        if (!superadmin) {
            await User.create({
                name: 'System Admin',
                email: 'superadmin@event.com',
                password: 'password123',
                role: 'superadmin'
            });
            console.log('Created Seed SuperAdmin.');
        } else {
            console.log(`Using existing SuperAdmin: ${superadmin.name}`);
        }

        const elabsAdmin = await checkAndCreate({
            name: 'Sniggg',
            email: 'sniggg@elabs.com',
            password: 'password123',
            role: 'admin',
            society: 'ELabs'
        });

        const ksacAdmin = await checkAndCreate({
            name: 'Raj Singh',
            email: 'raj@ksac.com',
            password: 'password123',
            role: 'admin',
            society: 'KSAC'
        });

        const student = await checkAndCreate({
            name: 'John Doe',
            email: 'john@student.com',
            password: 'password123',
            role: 'student'
        });

        console.log('Created Users.');

        // 2. Create Events
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 5);
        
        const futureDate1 = new Date();
        futureDate1.setDate(today.getDate() + 10);
        
        const futureDate2 = new Date();
        futureDate2.setDate(today.getDate() + 20);

        // 2. Create Events (with checks)
        const checkAndCreateEvent = async (eventData) => {
            const exists = await Event.findOne({ title: eventData.title });
            if (!exists) {
                return await Event.create(eventData);
            }
            return exists;
        };

        const event1 = await checkAndCreateEvent({
            title: 'ELabs Tech Workshop',
            description: 'A deep dive into modern robotics and AI. Join us for a hands-on session with industry experts.',
            date: futureDate1,
            venue: 'Innovation Center',
            capacity: 50,
            createdBy: elabsAdmin._id
        });

        const event2 = await checkAndCreateEvent({
            title: 'Cultural Night 2026',
            description: 'Celebrate the spirit of diversity with music, dance, and drama. A night to remember!',
            date: futureDate2,
            venue: 'Open Air Theater',
            capacity: 200,
            createdBy: ksacAdmin._id
        });

        const pastEvent = await checkAndCreateEvent({
            title: 'Winter Hackathon 2025',
            description: 'The annual 24-hour hackathon where code meets creativity.',
            date: pastDate,
            venue: 'Auditorium',
            capacity: 100,
            createdBy: elabsAdmin._id,
            registeredCount: 85
        });

        console.log('Created Events.');

        // 3. Create some registrations (with checks)
        const checkAndReg = async (regData) => {
            const exists = await Registration.findOne(regData);
            if (!exists) {
                await Registration.create(regData);
                const event = await Event.findById(regData.eventId);
                if (event) {
                    event.registeredCount += 1;
                    await event.save();
                }
            }
        };

        await checkAndReg({
            userId: student._id,
            eventId: event1._id
        });

        await checkAndReg({
            userId: student._id,
            eventId: pastEvent._id
        });

        console.log('Created Registrations.');
        console.log('Database Seeded Successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
