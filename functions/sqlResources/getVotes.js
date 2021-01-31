const knex = require('./dbconnectionKnex');

const getVotes = (telegramID) => {
  return knex('Palpiteiros')
        .select('*')
        .where('TelegramID', telegramID)
        .then(data => {
          return JSON.parse(JSON.stringify(data))
        })
        .catch((err) => console.log(err));
}

module.exports = getVotes