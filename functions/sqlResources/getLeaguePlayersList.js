const knex = require('./dbconnectionKnex');

const getLeaguePlayersList = (telegramIDDono) => {
  return knex.select(knex.raw('Palpiteiros.Nome as Nome, Palpiteiros.Pontos as Pontos'))
    .from('Palpiteiros')
    .innerJoin('Ligas', 'Palpiteiros.TelegramID', 'Ligas.TelegramIDParticipante')
    .where('Ligas.TelegramIDDono', telegramIDDono)
    .orderBy([{ column: 'Pontos', order: 'desc' }, { column: 'Nome' }])
    .then(data => {
      return JSON.parse(JSON.stringify(data))
    })
    .catch((err) => console.log(err));
}

module.exports = getLeaguePlayersList

// SELECT Palpiteiros.Nome as Nome, Palpiteiros.Pontos as Pontos
// FROM Palpiteiros INNER JOIN Ligas
// ON Palpiteiros.TelegramID = Ligas.TelegramIDParticipante
// WHERE Ligas.TelegramIDDono = TelegramID
// ORDER BY Nome