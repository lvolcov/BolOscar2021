const knex = require('./dbconnectionKnex');

const changeName = (telegramID, newName) => {
    return knex('Palpiteiros')
          .where('TelegramID', telegramID)
          .update({Nome : newName})
          .then(data => {
              return data
          }) 
          .catch((err) => console.log(err));
}

module.exports = changeName