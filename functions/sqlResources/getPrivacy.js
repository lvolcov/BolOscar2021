const knex = require('./dbconnectionKnex');

const getPrivacy = (nomeLiga) => {
  return knex('Ligas')
    .select('Privada')
    .whereRaw(`TelegramIDDono = TelegramIDParticipante AND NomeLiga = '${nomeLiga}'`)
    .groupBy('NomeLiga')
    .then(data => {
      return JSON.parse(JSON.stringify(data.map((elem) => elem.Privada)))
    })
    .catch((err) => console.log(err));
}

module.exports = getPrivacy