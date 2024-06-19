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
const dbURI = 'mongodb+srv://yg2707320:m6Q6S4c6jaLfKM4A@cluster0.eugti5f.mongodb.net/my_database?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log(err));

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobileNo: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10 digit mobile number!`
        },
        required: [true, 'Mobile number required']
    },
    emailId: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'Email required']
    },
    address: String,
    street: String,
    city: String,
    state: String,
    country: String,
    loginId: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid login ID!`
        },
        required: [true, 'Login ID required']
    },
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            },
            message: props => `Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character`
        },
        required: [true, 'Password required']
    },
    creationTime: {
        type: Date,
        default: Date.now
    },
    lastUpdatedOn: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Serve the HTML files
app.use(express.static(path.join(__dirname, 'public')));

// API to save user data
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// API to get user data
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
