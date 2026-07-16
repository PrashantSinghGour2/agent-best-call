import dotenv from 'dotenv';
dotenv.config(); // must run before any module that reads process.env (e.g. bedrockService)

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import agentRoute from './routes/agentRoute.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/agent', agentRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
