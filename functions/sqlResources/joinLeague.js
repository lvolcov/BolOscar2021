const knex = require('./dbconnectionKnex');
const getLeaguesOwner = require('../sqlResources/getLeaguesOwner')
const getPrivacy = require('../sqlResources/getPrivacy')

const joinLeague = (async (nomeLiga, TelegramIDParticipante) => {
  const TelegramIDDono = await getLeaguesOwner(nomeLiga)
  const privacy = await getPrivacy(nomeLiga)[0]
  return knex('Ligas')
    .insert({ NomeLiga: nomeLiga, TelegramIDDono: TelegramIDDono, TelegramIDParticipante: TelegramIDParticipante, Privada: privacy })
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
})

module.exports = joinLeague
