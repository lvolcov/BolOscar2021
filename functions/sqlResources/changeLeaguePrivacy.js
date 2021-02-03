const knex = require('./dbconnectionKnex');

const changeLeaguePrivacy = (telegramID, newPrivacy) => {
    return knex('Ligas')
        .where('TelegramIDDono', telegramID)
        .update({ Privada: newPrivacy })
        .then(data => {
            return data
        })
        .catch((err) => console.log(err));
}

module.exports = changeLeaguePrivacy