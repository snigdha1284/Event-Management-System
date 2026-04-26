const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const countSuperAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management');
        const superAdmins = await User.find({ role: 'superadmin' });
        console.log(`Found ${superAdmins.length} superadmins:`);
        superAdmins.forEach(s => console.log(`- ${s.name} (${s.email})`));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

countSuperAdmins();
