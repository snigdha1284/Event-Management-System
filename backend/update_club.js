const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateClub = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management');
        console.log('Connected to MongoDB');

        const user = await User.findOne({ name: /sniggg/i });
        if (!user) {
            console.log('User sniggg not found');
            process.exit(1);
        }

        user.society = 'ELabs';
        await user.save();
        
        console.log(`Updated society for ${user.name} to ELabs`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating club:', error);
        process.exit(1);
    }
};

updateClub();
