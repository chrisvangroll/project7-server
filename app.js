const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const helmet = require('helmet');
require('dotenv/config');

const dbConfig = {
    user: 'bac62c3de62c0a',
    host: 'us-cdbr-east-04.cleardb.com',
    password: process.env.DB_PASSWORD,
    database: 'heroku_c2f01276b68d472'
}

let db;
function handleDisconnect() {
    console.log('dbconfig')
    db = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.
    db.connect(function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }
        else {
            console.log('connected to DB')
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    db.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();

//middleware
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})


app.use(helmet());

app.use(bodyParser.json());
const forumRoutes = require('./routes/forum');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/forum', forumRoutes);

app.use('/comment', commentRoutes);

app.use('/auth', userRoutes);





module.exports = app;