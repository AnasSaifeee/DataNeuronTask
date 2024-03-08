const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserDetails = require('./userDetails');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://smart_class:anas123@cluster0.qwoc6oi.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a new user
app.post('/adduser', async (req, res) => {
  try {
    const { userName, userEmail, otherDetails } = req.body;

    const newUser = new UserDetails({
      userName,
      userEmail,
      otherDetails
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Get all users
app.get('/getusers', async (req, res) => {
  try {
    const users = await UserDetails.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user by userEmail
app.put('/users/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const user = await UserDetails.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (req.body.userName != null) {
      user.userName = req.body.userName;
    }
    if (req.body.userEmail != null) {
      user.userEmail = req.body.userEmail;
    }
    if (req.body.otherDetails != null) {
      user.otherDetails = req.body.otherDetails;
    }

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user by userEmail
app.delete('/users/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  try {
    const result = await UserDetails.deleteOne({ userEmail });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error("error is", err);
    res.status(500).json({ message: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
