const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    pool: { min: 0, max: 7 }
  });


module.exports = knex;

// https://stackfame.com/knexjs-complete-tutorial