const knex = require('./dbconnectionKnex');

const getWinners = () => {
  return knex('Vencedores')
    .select('*')
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
}

module.exports = getWinners