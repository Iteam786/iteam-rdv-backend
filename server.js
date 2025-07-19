import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rendezvousRoutes from './routes/rendezvousRoutes.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes principales
app.use('/api/rendezvous', rendezvousRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('🕌 Iteam Réunion Appointment API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
