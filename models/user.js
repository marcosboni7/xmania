const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    // Cria um novo usuário
    createUser: async (username, password) => {
        try {
            // Faz o hash da senha antes de armazená-la no banco de dados
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2)',
                [username, hashedPassword]
            );
            return result;
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            throw new Error('Erro ao criar conta. Tente novamente.');
        }
    },

    // Busca um usuário pelo nome de usuário
    findUserByUsername: async (username) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows[0]; // Retorna o primeiro usuário encontrado
        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
            throw new Error('Erro ao buscar usuário. Tente novamente.');
        }
    },

    // Verifica se a senha fornecida corresponde ao hash armazenado
    verifyPassword: async (inputPassword, storedPassword) => {
        return await bcrypt.compare(inputPassword, storedPassword);
    },
};

module.exports = User;
