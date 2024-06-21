const io = require('socket.io-client');

const socket = io();

// Join 'live users' room
socket.emit('joinLiveUsers');

// Handle new user joined
socket.on('userJoined', (userData) => {
    addUserToList(userData);
});

// Handle user left
socket.on('userLeft', (socketId) => {
    removeUserFromList(socketId);
});

// Function to add user to the list
function addUserToList(userData) {
    const userList = document.getElementById('userList');
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.innerHTML = `<strong>Email ID:</strong> ${userData.emailId} | <strong>Socket ID:</strong> ${userData.socketId}`;
    
    // Add click event to fetch user details
    userDiv.addEventListener('click', () => {
        fetchUserData(userData.emailId);
    });

    userList.appendChild(userDiv);
}

// Function to remove user from the list
function removeUserFromList(socketId) {
    const userList = document.getElementById('userList');
    const users = userList.getElementsByClassName('user');
    for (let user of users) {
        if (user.innerHTML.includes(socketId)) {
            userList.removeChild(user);
            break;
        }
    }
}

// Function to fetch user data from API
async function fetchUserData(emailId) {
    try {
        const response = await fetch(`http://localhost:4000/api/users?emailId=${encodeURIComponent(emailId)}`);
        const userData = await response.json();

        // Display user data in a popup (you can use a modal here)
        alert(JSON.stringify(userData, null, 2));
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data');
    }
}
