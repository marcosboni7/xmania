const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Rota principal redireciona para login
router.get('/', (req, res) => {
    res.redirect('/login'); // Redireciona diretamente para a página de login
});

// Rota para exibir a página de login
router.get('/login', (req, res) => {
    const message = req.flash('message'); // Captura a mensagem de erro, se houver
    res.render('login', { message }); // Renderiza a página de login
});

// Rota para exibir a página de registro
router.get('/register', (req, res) => {
    const message = req.flash('message'); // Captura a mensagem de erro, se houver
    res.render('register', { message }); // Renderiza a página de registro
});

// Rota para processar o login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findUserByUsername(username);

        // Verifique se o usuário existe e a senha está correta
        if (user && await User.verifyPassword(password, user.password)) {
            req.session.userId = user.id; // Armazena o ID do usuário na sessão
            console.log(`Usuário ${username} logado com sucesso!`); // Log de sucesso no login
            return res.redirect('/dashboard'); // Redireciona para a página de dashboard
        } else {
            console.warn(`Falha ao logar: Usuário ${username} não encontrado ou senha incorreta.`); // Log de falha no login
            req.flash('message', 'Usuário ou senha incorretos');
            return res.redirect('/login'); // Redireciona para a página de login
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        req.flash('message', 'Erro ao fazer login. Tente novamente.');
        return res.redirect('/login'); // Redireciona para a página de login
    }
});

// Rota para processar o registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        await User.createUser(username, password);
        console.log(`Usuário ${username} criado com sucesso!`); // Log de sucesso no registro
        req.flash('message', 'Usuário criado com sucesso. Você ganhou um emblema de boas-vindas! 🎉');
        res.redirect('/login'); // Redireciona para a página de login após registro
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        req.flash('message', 'Erro ao criar conta. Tente novamente.');
        return res.redirect('/register'); // Redireciona para a página de registro
    }
});

// Rota de dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        console.warn('Tentativa de acesso à dashboard sem autenticação.'); // Log de acesso não autorizado
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    console.log(`Usuário com ID ${req.session.userId} acessando a dashboard.`); // Log de acesso à dashboard
    res.render('dashboard', { userId: req.session.userId }); // Renderiza a página de dashboard
});

// Rota para processar o logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar sessão:', err);
            return res.redirect('/dashboard'); // Redireciona de volta para o dashboard em caso de erro
        }
        res.clearCookie('connect.sid'); // Limpa o cookie da sessão
        console.log('Sessão encerrada com sucesso. Redirecionando para a página de login.'); // Log de logout
        res.redirect('/login'); // Redireciona para a página de login
    });
});

// Expor as rotas
module.exports = router;
