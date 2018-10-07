import mysql from 'mysql'

export function testConnection (options, callback) {
  const connection = mysql.createConnection({
    host: options.host,
    user: options.username,
    password: options.password,
    database: options.database
  })
  connection.connect(callback)
}

export function query (options, callback) {
  const connection = mysql.createConnection({
    host: options.host,
    user: options.username,
    password: options.password,
    database: options.database
  })
  connection.query(options.sql, function (error, results, fields) {
    if (error) console.log('mysql error:' + error)
    callback(results, fields, error)
  })
}
