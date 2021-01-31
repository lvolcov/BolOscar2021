const knex = require('./dbconnectionKnex');

const getNamesExistingLeagues = () => {
  return knex('Ligas')
        .select('NomeLiga')
        .groupBy('NomeLiga')
        .then(data => {
          return JSON.parse(JSON.stringify(data.map((elem) => elem.NomeLiga)))
        })
        .catch((err) => console.log(err));
}

module.exports = getNamesExistingLeagues