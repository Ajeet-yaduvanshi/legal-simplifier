const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  console.log("REQ BODY:", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Sabhi fields required hain.' });
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered.' });
    const user  = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
     console.error("REGISTER ERROR:", err);
    res.status(500).json({ 
      message: err.message,
       stack: err.stack
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email registered nahi hai.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Password galat hai.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ 
      message: err.message,
       stack: err.stack
     });
  }
});

module.exports = router;