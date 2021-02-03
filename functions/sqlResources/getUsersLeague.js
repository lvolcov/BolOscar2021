const knex = require('./dbconnectionKnex');

const getLeaguesList = (telegramID) => {
  return knex('Ligas')
        .select('NomeLiga')
        .where('TelegramIDParticipante', telegramID)
        .groupBy('NomeLiga')
        .then(data => {
          return JSON.parse(JSON.stringify(data.map((elem) => elem.NomeLiga)))
        })
        .catch((err) => console.log(err));
}

module.exports = getLeaguesList