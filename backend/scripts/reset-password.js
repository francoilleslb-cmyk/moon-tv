const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const resetPassword = async () => {
    try {
        console.log('Attemping to connect to MongoDB...');
        if (!process.env.MONGODB_URI) {
            console.error('ERROR: MONGODB_URI is undefined');
            process.exit(1);
        }
        const uri = process.env.MONGODB_URI;
        console.log(`Connecting to: ${uri.substring(0, 20)}...`);

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB Connected');

        const email = 'francoilleslb@gmail.com';
        const newPassword = 'algoasi';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('Usuario no encontrado');
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();

        console.log(`Contraseña actualizada correctamente para ${email}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetPassword();
