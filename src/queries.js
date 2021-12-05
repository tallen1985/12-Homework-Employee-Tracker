const mySQL = require('mysql2')

const db = mySQL.createConnection(
    {
      host: '127.0.0.1',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_tracker'
    },
    console.log(`Connected to the classlist_db database.`)
  );

function queryDB(answer) {
    answerArray = answer.split(' ')
    const method = answerArray[0].toLowerCase();
    let table = answerArray[answerArray.length - 1]
    if(method === 'view'){
        if (table == 'Roles') {
            table = 'role'
        }
        db.query('SELECT * FROM ??', table, (error, result) => {
            console.table(result);
            return result;
        })
    }}

module.exports = queryDB;