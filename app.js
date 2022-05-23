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
app.get('/task/:id', (req, res) => {
    const tache = Taches.get(parseInt(req.params.id));
    if (!tache) {
        throw new Error('Aucune tache trouvée');
    }
    res.status(200).send(tache);
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
app.put('/task/:id', (req, res) => {
    if (parseInt(req.params.id) === NaN) {
        throw new Error("Ceci n'est pas une clé valable");
    }
    const payload = req.body;
    const scheme = Joi.object({
        description: Joi.string().max(255).required(),
        faite: Joi.boolean().required()
    });
    const {value, error} = scheme.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    Taches.update(parseInt(req.params.id), value);
    res.status(200).send(value);
});

app.delete('/task/:id', (req, res) => {
    if (parseInt(req.params.id) === NaN) {
        throw new Error("Ceci n'est pas une clé valable");
    }
    Taches.delete(parseInt(req.params.id));
    res.status(200).send("Ressources supprimée");
});

app.use((err, req, res, next) => {
    res.status(400).send({error: err.message});
});

if (process.env.NODE_ENV !== "test") {
    app.listen(3000);
}
module.exports = { app, Taches };