const mysql = require("mysql");
const config = {
  host: "localhost",
  user: "root",
  password: "yourpassword",
  database: "数据库名",
};
const client = mysql.createConnection(config);
// sql语句
function sqlQuery(sql, callback) {
  client.query(sql, (err, result) => {
    if (err) {
      return console.log("错误:" + err);
    }
    callback(result);
  });
}
module.exports = sqlQuery;