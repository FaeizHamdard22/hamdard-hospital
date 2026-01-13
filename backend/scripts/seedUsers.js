import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists. Skipping seed.');
            await mongoose.connection.close();
            return;
        }

        // Create default admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@hamdard.com',
            password: 'admin123', // This will be hashed automatically
            role: 'admin',
            isActive: true
        });

        console.log('✅ Default admin user created successfully!');
        console.log('📋 Login Credentials:');
        console.log('   Username: admin');
        console.log('   Email: admin@hamdard.com');
        console.log('   Password: admin123');
        console.log('   Role: admin');

        // Create a test receptionist user
        const receptionistUser = await User.create({
            username: 'receptionist',
            email: 'receptionist@hamdard.com',
            password: 'receptionist123',
            role: 'receptionist',
            isActive: true
        });

        console.log('\n✅ Default receptionist user created!');
        console.log('📋 Login Credentials:');
        console.log('   Username: receptionist');
        console.log('   Email: receptionist@hamdard.com');
        console.log('   Password: receptionist123');
        console.log('   Role: receptionist');

        await mongoose.connection.close();
        console.log('\n✅ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedUsers();

