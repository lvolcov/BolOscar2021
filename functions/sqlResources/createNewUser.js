var mysql = require('mysql');

const newUser = (telegramID, nomeOriginal, nomeAlterado) => {
  var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  const query = `INSERT INTO Palpiteiros (TelegramID, NomeOriginal, Nome) VALUES ("${telegramID}", "${nomeOriginal}", "${nomeAlterado}")`
  return new Promise( ( resolve, reject ) => {
    con.query(query, (err, result, fields) => {
      if (err)
      throw err;
      resolve(JSON.parse(JSON.stringify(result)));
    });
    con.end()
  })
}

module.exports = newUser
