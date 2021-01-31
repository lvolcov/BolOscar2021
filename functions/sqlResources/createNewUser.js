const knex = require('./dbconnectionKnex');

const newUser = (telegramID, nomeOriginal, nomeAlterado) => {
  return knex('Palpiteiros')
        .insert({TelegramID : telegramID, NomeOriginal : nomeOriginal, Nome : nomeAlterado})
        .then(data => {
          return data
        })
        .catch((err) => console.log(err));
}

module.exports = newUser
