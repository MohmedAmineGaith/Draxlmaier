require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const Admin = require('./models/Admin');
const authRoutes = require('./routes/auth');
const formulaireRoutes = require('./routes/formulaires');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/formulaires', formulaireRoutes);
app.use('/api/stats', statsRoutes);

async function ensureDefaultAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';
  const existing = await Admin.findOne({ username });
  if (!existing) {
    await Admin.create({ username, password });
    console.log(`Compte admin créé : ${username}`);
  }
}

async function start() {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Impossible de démarrer le serveur:', err);
  process.exit(1);
});
