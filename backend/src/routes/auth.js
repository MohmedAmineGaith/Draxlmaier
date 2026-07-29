const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Identifiant et mot de passe requis' });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { username: admin.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: { username: req.admin.username } });
});

module.exports = router;
