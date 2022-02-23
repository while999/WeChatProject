const io = require("./io");
const { getNetworkIPv4 } = require("./utils");
const express = require('express');
const sqlQuery = require("./dbconfig"); // 引入mysql模块
const bodyParser = require('body-parser');/*支持post方法*/
const { stringify } = require("querystring");

const app = express();
const server = require('http').createServer(app);
app.use("/", express.static('dist'));
const PORT = 3000;
io.attach(server);

app.use(bodyParser.json());// 添加json解析
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 服务端响应login接口，POST请求方式
app.post('/login', function (req, res, next) {
  try {
    const username = req.body.username; //获取post请求参数
    const pwd = req.body.password;
    console.log("收到post请求:username:" + username + "pwd:" + pwd);
    if (username && pwd) {

      var sql = "select * from User where username='" + username + "'";

      sqlQuery(sql, (data) => {
        if (data.length > 0) {
          console.log(data);
          if (data[0].password == pwd) {
            return res.json({
              code: "200",
              name: data[0].name,
              message: "登录成功",
            });
          }
          else {
            return res.json({
              code: "500",
              name: data[0].name,
              message: "密码错误！",
            });
          }
        }
        else {
          console.log(sql);
          res.json({
            code: "500",
            message: "用户不存在",
          });
        }
      });
    }
    else { res.json({ code: "500" }) }
  } catch (error) {
    console.log(error)
    res.json({ code: "500" });
  }

}
);
app.post('/register', function (req, res, next) {
  try {
    const username = req.body.username; //获取post请求参数
    const pwd = req.body.password;
    const name = req.body.name;

    console.log("收到post请求:username:" + username + "pwd:" + pwd + "name:" + name);
    if (username && pwd && name) {
      var ident = "SELECT LAST_INSERT_ID() as id";
      var sql = "select * from User where username='" + username + "' or name='" + name + "'";
      var insert = "insert into User (username,password,name) values (" + "'" + username + "','" + pwd + "','" + name + "') ";
      sqlQuery(sql, (data) => {
        if (data.length > 0) {
          console.log(data);

          return res.json({
            code: "500",
            message: "该账户已注册",
          });
        }
        else {
          sqlQuery(insert, (re) => {
          });
          sqlQuery(ident, (re) => {

            console.log(re[0].id);
            if (re[0].id > 0) {
              return res.json({
                code: "200",
                message: "注册成功！",
              });
            }
            else {
              return res.json({
                code: "500",
                message: "注册失败，请求错误！",
              });
            }
          });
        }
      });
    }
    else { res.json({ code: "500", message: "请求错误！" }) }
  } catch (error) {
    console.log(error)
    res.json({ code: "500", message: "请求错误！" });
  }

}
);
//启动服务器
server.listen(PORT, () => {
  const address = getNetworkIPv4().address;
  console.info("- Local:   http://localhost:" + PORT);
  console.info(`- Network: http://${address}:` + PORT)
});
