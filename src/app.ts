import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

// Serves static files from the 'frontend/dist' directory
app.use(express.static('frontend/dist'));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
