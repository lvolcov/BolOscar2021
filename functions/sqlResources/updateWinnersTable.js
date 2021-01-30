var mysql = require('mysql');

const updateWinnersTable = (categoria, vencedor) => {
    var con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
  });
    const query = `UPDATE Vencedores SET Vencedor = "${vencedor}" WHERE Categoria = "${categoria}"`
    return new Promise( ( resolve, reject ) => {
        con.query(query, (err, result, fields) => {
            if (err)
            throw err;
            resolve(JSON.parse(JSON.stringify(result)));
        });
    con.end()
  })
}

module.exports = updateWinnersTable
