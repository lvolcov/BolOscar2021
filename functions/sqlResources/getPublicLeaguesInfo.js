const knex = require('./dbconnectionKnex');

const getPublicLeaguesInfo = () => {
  return knex('Ligas')
    .select(knex.raw('NomeLiga, COUNT(*) as Participantes'))
    .where('Privada', 1)
    .groupBy('NomeLiga')
    .orderBy(2, 'desc')
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
}

module.exports = getPublicLeaguesInfo