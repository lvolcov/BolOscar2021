const knex = require('./dbconnectionKnex');

const changeLeagueName = (telegramID, newName) => {
    return knex('Ligas')
        .where('TelegramIDDono', telegramID)
        .update({ NomeLiga: newName })
        .then(data => {
            return data
        })
        .catch((err) => console.log(err));
}

module.exports = changeLeagueName