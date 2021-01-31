const knex = require('./dbconnectionKnex');

const deleteVotes = ((telegramID) => {
  return knex('Palpiteiros')
        .where('TelegramID', telegramID)
        .del()
        .then(data => {
          return data
        })
        .catch((err) => console.log(err));
})

module.exports = deleteVotes