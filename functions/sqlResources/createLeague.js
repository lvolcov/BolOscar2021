const knex = require('./dbconnectionKnex');

const createLeague = (nomeLiga, telegramID) => {
  return knex('Ligas')
        .insert({NomeLiga : nomeLiga, TelegramIDDono : telegramID, TelegramIDParticipante : telegramID})
        .then(data => {
          return data
        })
        .catch((err) => console.log(err));
}

module.exports = createLeague
