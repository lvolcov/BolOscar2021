var mysql = require('mysql');
const newUser = require('./createNewUser')

const resetVotes = (telegramID, nome) => {
  var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  const query = `DELETE FROM Palpiteiros WHERE TelegramID = ${telegramID}`
  return new Promise( ( resolve, reject ) => {
    con.query(query, (err, result, fields) => {
      if (err)
      throw err;
      resolve(JSON.parse(JSON.stringify(result)));
    });
    newUser(telegramID, nome)
    con.end()
  })
}

module.exports = resetVotes