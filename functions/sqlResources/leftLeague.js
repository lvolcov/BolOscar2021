const knex = require('./dbconnectionKnex');

const leftLeague = (async (NomeLiga, TelegramIDParticipante) => {
  return knex('Ligas')
    .where({
      ['NomeLiga']: NomeLiga,
      ['TelegramIDParticipante']: TelegramIDParticipante
    })
    .del()
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
})

module.exports = leftLeague
