const knex = require('./dbconnectionKnex');

const getLeaguesAmountUsers = (telegramID) => {
  return knex('Ligas')
        .select(knex.raw('NomeLiga, COUNT(*) as Participantes'))
        .groupBy('NomeLiga')
        .orderBy(2, 'desc')
        .then(data => {
          return JSON.parse(JSON.stringify(data))
        })
        .catch((err) => console.log(err));
}

module.exports = getLeaguesAmountUsers