const knex = require('./dbconnectionKnex');

const getLeaguesDetails = (telegramID) => {
  return knex('Ligas')
        .where('TelegramIDParticipante', telegramID)
        .then(data => {
          return JSON.parse(JSON.stringify(data))
        })
        .catch((err) => console.log(err));
}

module.exports = getLeaguesDetails