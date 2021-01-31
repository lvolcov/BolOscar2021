const knex = require('./dbconnectionKnex');

const getLeaguesOwner = (nomeLiga) => {
  return knex('Ligas')
        .select('TelegramIDDono')
        .where('NomeLiga', nomeLiga)
        .groupBy('TelegramIDDono')
        .first()
        .then(data => {
          return JSON.parse(JSON.stringify(data.TelegramIDDono))
        })
        .catch((err) => console.log(err));
}

module.exports = getLeaguesOwner