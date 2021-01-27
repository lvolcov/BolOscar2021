var mysql = require('mysql');

const joinLeague = (nomeLiga, TelegramIDDono, TelegramIDParticipante) => {
  var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  const query = `INSERT INTO Ligas (NomeLiga, TelegramIDDono, TelegramIDParticipante) VALUES ("${nomeLiga}", ${TelegramIDDono}, ${TelegramIDParticipante})`
  return new Promise( ( resolve, reject ) => {
    con.query(query, (err, result, fields) => {
      if (err)
      throw err;
      resolve(JSON.parse(JSON.stringify(result)));
    });
    con.end()
  })
}

module.exports = joinLeague
