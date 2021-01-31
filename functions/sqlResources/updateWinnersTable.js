const knex = require('./dbconnectionKnex');

const updateWinnersTable = (categoria, vencedor) => {
    return knex('Vencedores')
          .where('Categoria', categoria)
          .update({Vencedor : vencedor})
          .then(data => {
            return JSON.parse(JSON.stringify(data))
          }) 
          .catch((err) => console.log(err));
}

module.exports = updateWinnersTable
