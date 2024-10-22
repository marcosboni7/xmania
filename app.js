const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./routes/index');
const path = require('path');

const app = express();

// Configurações do middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Configurando EJS como engine de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.redirect('/login'); // Redireciona para a página de login
});

// Rotas
app.use('/', userRoutes);

// Exporta o aplicativo para que a Vercel possa gerenciá-lo
module.exports = app;
