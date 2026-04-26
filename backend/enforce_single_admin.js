const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const enforceSingleSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management');
        
        // Remove the seed-created superadmin
        const result = await User.deleteOne({ email: 'superadmin@event.com' });
        if (result.deletedCount > 0) {
            console.log('Removed duplicate superadmin: superadmin@event.com');
        } else {
            console.log('Seed superadmin not found.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

enforceSingleSuperAdmin();
