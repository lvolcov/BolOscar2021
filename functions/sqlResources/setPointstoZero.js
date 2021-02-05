const knex = require('./dbconnectionKnex');

const setPointstoZero = () => {
  return knex('Palpiteiros')
    .update('Pontos', 0)
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
}

module.exports = setPointstoZero
