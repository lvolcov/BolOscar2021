const knex = require('./dbconnectionKnex');

const updatePoints = (categoria, vencedor, pontos) => {
  return knex('Palpiteiros')
    .where(categoria, vencedor)
    .increment('Pontos', pontos)
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
}

module.exports = updatePoints
