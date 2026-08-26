require('dotenv').config();
const dns = require('dns');
// Prevent ISP SRV query blocking on MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Updated model paths to match standard PascalCase file naming
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Message = require('./models/Message');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database for seeding...');

    // 1. Wipe collections in safe reverse dependency order
    await Message.deleteMany({});
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared old data.');

    // 2. Create Users (1 Admin, 1 Attendee)
    const hashedPassword = await bcrypt.hash('password123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: hashedPassword,
      role: 'admin',
    });

    const attendee = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'attendee',
    });
    console.log('Created seed users.');

    // 3. Create 3 Categories
    const categories = await Category.insertMany([
      { name: 'Technology', description: 'Tech conferences, hackathons, and software meetups.' },
      { name: 'Music', description: 'Live concerts, festivals, and acoustic performances.' },
      { name: 'Business', description: 'Networking, seminars, and startup pitches.' },
    ]);
    console.log('Created 3 seed categories.');

    // 4. Create 4 Sample Events
    await Event.insertMany([
      {
        title: 'Tech Innovation Summit 2026',
        description: 'Exploring modern web applications and microservices.',
        category: categories[0]._id,
        date: new Date('2026-10-15T09:00:00Z'),
        city: 'Cairo',
        venue: 'Grand Nile Tower',
        capacity: 200,
        organizer: admin._id,
      },
      {
        title: 'AI & Data Science Workshop',
        description: 'Hands-on Machine Learning with Python.',
        category: categories[0]._id,
        date: new Date('2026-11-01T10:00:00Z'),
        city: 'Alexandria',
        venue: 'Bibliotheca Alexandrina',
        capacity: 50,
        organizer: admin._id,
      },
      {
        title: 'Jazz Night by the Sea',
        description: 'An evening of smooth jazz music.',
        category: categories[1]._id,
        date: new Date('2026-09-20T20:00:00Z'),
        city: 'Alexandria',
        venue: 'San Stefano Hall',
        capacity: 100,
        organizer: admin._id,
      },
      {
        title: 'Startup Pitch Fest',
        description: 'Present your startup ideas to regional investors.',
        category: categories[2]._id,
        date: new Date('2026-12-05T14:00:00Z'),
        city: 'Cairo',
        venue: 'Greek Campus',
        capacity: 150,
        organizer: admin._id,
      },
    ]);
    console.log('Created 4 seed events.');

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();