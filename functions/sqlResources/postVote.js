const knex = require('./dbconnectionKnex');

const postVote = (telegramID, categoria, voto) => {
  return knex('Palpiteiros')
          .where('TelegramID', telegramID)
          .update({[categoria] : voto})
          .then(data => {
            return JSON.parse(JSON.stringify(data))
          }) 
          .catch((err) => console.log(err));
}

module.exports = postVote