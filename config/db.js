const mongoose = require('mongoose');
async function configDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('connected to db');
    } catch (err) {
        console.log('error connected to db', err.message);
    }
}
module.exports = configDB;





