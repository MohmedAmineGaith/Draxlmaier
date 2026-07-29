require('dotenv').config();
const { connectDB } = require('./config/db');
const Admin = require('./models/Admin');

async function seed() {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" existe déjà`);
  } else {
    await Admin.create({ username, password });
    console.log(`Admin "${username}" créé`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
