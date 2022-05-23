const express = require('express');
const app = express();
require('express-async-errors');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Bdd
const DbSet = require('./db.js');
const Taches = new DbSet('Taches');
const Users = new DbSet('Users');

if (!process.env.SECRET_KEY) {
    console.error("Error : Variable d'environnement 'SECRET_KEY' inexistante -- Exit Program");
    process.exit(1);
}

// Middleware
app.use(express.json());
// - Authentification
function authenticationToken(req, res, next){
    const token = req.header('x-auth-token');
    if (!token) {
        throw new Error('Vous devez vous connecté pour accéder à cette ressource');
    }
    try {
        const userInToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = userInToken;
        next();
    } catch (error) {
        throw new Error('Le token que vous avez fourni est invalide');
    }
}

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

app.post('/task', [authenticationToken], (req, res) => {
    const payload = req.body;
    const scheme = Joi.object({
        description: Joi.string().max(255).required(),
        faite: Joi.boolean().required()
    });
    const {value, error} = scheme.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    value.creePar = req.user.id;
    Taches.insert(value);
    res.status(201).send(value);
});
app.put('/task/:id', [authenticationToken], (req, res) => {
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

app.delete('/task/:id', [authenticationToken], (req, res) => {
    if (parseInt(req.params.id) === NaN) {
        throw new Error("Ceci n'est pas une clé valable");
    }
    const tache = Taches.get(parseInt(req.params.id));
    if (parseInt(req.user.id) !== parseInt(tache.creePar)) {
        throw new Error("Vous ne pouvez pas supprimer la tâche d'un autre utilisateur");
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
    const {entity} = Users.findBy('email', value.email);
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

app.post('/login', async (req, res) => {
    const payload = req.body;
    const scheme = Joi.object({
        email: Joi.string().max(255).email().required(),
        password: Joi.string().max(255).required()
    });
    const {value, error} = scheme.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const {id, entity} = Users.findBy('email', value.email);
    if (!entity) {
        throw new Error("Ce compte n'existe pas");
    }
    const goodHash = await bcrypt.compare(payload.password, entity.password);
    if (!goodHash) {
        throw new Error('Mot de passe invalide');
    }
    const token = jwt.sign({id}, process.env.SECRET_KEY);
    res.header('x-auth-token', token).status(200).send("Connexion réussie");
});

// Middleware d'erreur 400
app.use((err, req, res, next) => {
    res.status(400).send({error: err.message});
});

// Ecoute sur un port
if (process.env.NODE_ENV !== "test") {
    app.listen(3000);
}
module.exports = { app, Taches, Users };