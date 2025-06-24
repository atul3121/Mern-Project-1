// src/controller/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');

const secret = "13281c22-6b6a-67ba-a776-d847772d80eb";

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUser = await Users.findOne({ 
        $or: [{ username }, { email }] 
      });
      if (existingUser) {
        return res.status(401).json({ message: "User already exists with this username or email" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const newUser = new Users({
        username,
        email,
        password: hashed
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error during registration" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Try to find user by username or email
      const data = await Users.findOne({ 
        $or: [{ username }, { email: username }] 
      });

      if (!data || !(await bcrypt.compare(password, data.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = { id: data._id, name: data.name, email: data.email };
      const token = jwt.sign(user, secret, { expiresIn: '1h' });

      res.cookie('jwtToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      });

      res.json({ user, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('jwtToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
    res.json({ message: 'Logout successful' });
  },

  isUserLoggedIn: (req, res) => {
    const token = req.cookies.jwtToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      res.json({ user });
    });
  }
};

module.exports = authController;
