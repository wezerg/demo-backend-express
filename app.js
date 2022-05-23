const express = require('express');
const app = express();
const DbSet = require('./db.js');
const Taches = new DbSet('Taches');

// Routes Taches
app.get('/', (req, res) => {
    const taches = Taches.getAll();
    res.status(200).send(taches);
});

if (process.env.NODE_ENV !== "test") {
    app.listen(3000);
}
module.exports = { app, Taches };