const express = require('express');
const app = express();
const Joi = require('joi');
const bcrypt = require('bcrypt');

// Bdd
const DbSet = require('./db.js');
const Taches = new DbSet('Taches');
const Users = new DbSet('Users');

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

// Route Login - Register
app.post('/register', async (req, res) => {
    const payload = req.body;
    // Joi
    const scheme = Joi.object({
        email: Joi.string().max(255).email().required(),
        username: Joi.string().max(255).required(),
        password: Joi.string().max(255).required()
    });
    const {value, error} = scheme.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Vérification d'un compte existant en base de données
    const {id, entity} = Users.findBy('email', value.email);
    if (entity) {
        throw new Error("Un compte existe déja");
    }
    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(value.password, salt);
    value.password = passwordHash;
    // Enregistrement en bdd
    Users.insert(value);
    // Renvoit
    res.status(201).send({email: value.email, username: value.username});
});



// Middleware d'erreur 400
app.use((err, req, res, next) => {
    res.status(400).send({error: err.message});
});

// Ecoute sur un port
if (process.env.NODE_ENV !== "test") {
    app.listen(3000);
}
module.exports = { app, Taches };