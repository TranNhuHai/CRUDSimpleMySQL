const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const port = 8080;
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pw123123',
  database: 'userDB',
  port: 3036,
  multipleStatements: true
});

app.listen(port, () => console.log(`Server listening at ${port}`));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './views');

mysqlConnection.connect((err) => {
  if (err) console.log('DB connection failed \n Err:' + JSON.stringify(err, undefined, 2));
  else console.log('DB connect success');
});

//get home page
app.get('/', function (req, res) {
  res.render('index');
});

//get users 
app.get('/users', function (req, res) {
  mysqlConnection.query('SELECT * FROM User', (err, users, fields) => {
    if (!err)
      res.render('users/users', users);
    else
      res.render('users/users', err);
  });
});
//get user
app.get('/user', function (req, res) {
  res.render('users/user');
})
app.get('/user/:id', function (req, res) {
  mysqlConnection.query('SELECT * FROM User WHERE UserID = ?', [req.params.id], (err, user, fields) => {
    if (!err)
      res.render('users/user', user);
    else
      res.render('users/user', err);
  })
});
// create user
app.get('/create', function (req, res) {
  res.render('users/create');
});
app.post('/create', function (req, res) {
  let user = req.body;
  var sql = "SET @UserID = ?;SET @Name = ?;SET ; \
    CALL UserAddOrEdit(@UserID,@Name);";
  mysqlConnection.query(sql, [user.EmpID, user.name], (err, user, fields) => {
    if (!err)
      user.forEach(element => {
        if (element.constructor == Array)
          res.render('users/create', user);
      });
    else
      res.render('users/create', err)
  })
});

//update
app.get('/update', function (req, res) {
  res.render('users/update');
});
app.put('/update/:id', function (req, res) {
  let user = req.body;
  var sql = "SET @UserID = ?;SET @Name = ?; \
    CALL UserAddOrEdit(@UserId,@Name);";
  mysqlConnection.query(sql, [user.UserID, user.name], (err, user, fields) => {
    if (!err)
      res.render('users/update', 'Updated successfully');
    else
      res.render('users/update', err);
  });
});
//delete
app.get('/delete', function (req, res) {
  res.render('users/delete');
});
app.delete('/delete/:id', function (req, res) {
  mysqlConnection.query('DELETE FROM User WHERE UserID = ?', [req.params.id], (err, user, fields) => {
    if (!err)
      res.render('users/delete', user);
    else
      res.render('users/delete', err);
  });
});