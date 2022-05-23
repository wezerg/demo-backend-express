const express = require('express');
const app = express();
const Joi = require('joi');
// Bdd
const DbSet = require('./db.js');
const Taches = new DbSet('Taches');

// Middleware
app.use(express.json());

// Routes Taches
app.get('/task', (req, res) => {
    const taches = Taches.getAll();
    res.status(200).send(taches);
});

app.post('/task', (req, res) => {
    const payload = req.body;
    const scheme = Joi.object({
        description: Joi.string().max(255).required(),
        faite: Joi.boolean().required()
    });
    const {value, error} = scheme.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    Taches.insert(value);
    res.status(201).send(value);
});

if (process.env.NODE_ENV !== "test") {
    app.listen(3000);
}
module.exports = { app, Taches };