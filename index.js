import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import statsRouter from './routes/stats.js';
import teamsRouter from './routes/teams.js';
import connectDB from './db/connect.js';



const app = express();

app.use(cors());

app.use('/assets', express.static('assets'));

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/api/pokemons', pokemonsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/teams', teamsRouter);


const port = process.env.PORT || 3000;

await connectDB();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
