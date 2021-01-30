var mysql = require('mysql');

const getLeaguesList = (telegramID) => {
  var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  const query = `SELECT NomeLiga FROM Ligas WHERE TelegramIDParticipante = ${telegramID} GROUP BY NomeLiga`
  return new Promise( ( resolve, reject ) => {
    con.query(query, (err, result, fields) => {
      if (err)
      throw err;
      resolve(JSON.parse(JSON.stringify(result.map((elem) => elem.NomeLiga))));
    });
    con.end()
  })
}

module.exports = getLeaguesList