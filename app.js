const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('../routes/index');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Rotas
app.use('/', userRoutes);

// Exporta para Vercel
module.exports = app;
