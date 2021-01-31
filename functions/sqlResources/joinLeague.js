const knex = require('./dbconnectionKnex');
const getLeaguesOwner = require('../sqlResources/getLeaguesOwner')

const joinLeague = (async (nomeLiga, TelegramIDParticipante) => {
  const TelegramIDDono = await getLeaguesOwner(nomeLiga)
  return knex('Ligas')
        .insert({NomeLiga : nomeLiga, TelegramIDDono : TelegramIDDono, TelegramIDParticipante : TelegramIDParticipante})
        .then(data => {
          return JSON.parse(JSON.stringify(data))
        })
        .catch((err) => console.log(err));
})

module.exports = joinLeague
