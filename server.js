const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://yg2707320:m6Q6S4c6jaLfKM4A@cluster0.eugti5f.mongodb.net/new_database?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your actual MongoDB connection string
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the User schema
const userSchema = new mongoose.Schema({
    // Your schema fields
});

const User = mongoose.model('User', userSchema);

// Serve the HTML files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to save user data
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// API endpoint to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
