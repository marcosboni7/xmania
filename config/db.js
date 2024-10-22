const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'xmania_user',
    host: process.env.DB_HOST || 'dpg-csbqj323esus73fvmskg-a.frankfurt-postgres.render.com',
    database: process.env.DB_NAME || 'xmania',
    password: process.env.DB_PASSWORD || 'u33KPkTeAxgDkgOOBByB5791vwf3oksI',
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Para desenvolvimento, você pode usar esta opção, mas para produção, considere usar uma abordagem mais segura.
    }
});

// Testando a conexão ao banco de dados
pool.connect()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucessooo!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
};
