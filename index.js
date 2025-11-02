const express = require("express");
const cors = require("cors");
require('dotenv').config();
const configDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const screenRoutes = require('./routes/screenRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
configDB();

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theater', theaterRoutes);
app.use('/api/screen', screenRoutes);

app.get('/', (req, res) => res.send('API running'));
// app.post('/test', (req, res) => {
//     console.log(req.body);
//     res.json(req.body);
// });

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
 