const express = require("express");
const cors = require("cors");
require('dotenv').config();
const configDB = require('./config/db');
const port = process.env.PORT || 5000
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors());
configDB();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API running'));

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
 