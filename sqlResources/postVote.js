var mysql = require('mysql');

const postVote = (telegramID, categoria, voto) => {
  var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });
  const query = `UPDATE Palpiteiros SET ${categoria} = "${voto}" WHERE TelegramID = ${telegramID}`
  return new Promise( ( resolve, reject ) => {
    con.query(query, (err, result, fields) => {
      if (err)
      throw err;
      resolve(JSON.parse(JSON.stringify(result)));
    });
    con.end()
  })
}

module.exports = postVote