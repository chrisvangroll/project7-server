// const { restart } = require('nodemon');
const mysql = require('mysql');
require('dotenv/config');
const fs = require('fs');


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

exports.getAllPosts = (req, res, next)=>{
   // console.log(req.headers.authorization)
   // console.log('abc')
    let sql = "SELECT uploads.content, uploads.id, uploads.author, uploads.id, uploads.title, users.name FROM uploads INNER JOIN users ON uploads.author = users.id ";
    db.query(sql, async (err, results)=> {
        try{
            const allPosts = await res.status(200).json(results);
        }catch{
            res.status(400).json({message: err});
        }
    })
}

exports.getAdmin = (req, res, next)=>{
    let sql = "SELECT * FROM admin";
    db.query(sql, async (err, results)=> {
        try{
            const allPosts = await res.status(200).json(results);
        }catch{
            res.status(400).json({message: err});
        }
    })
}



exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    const sql =    `DELETE from uploads
                    WHERE id = ${postId}`

    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(200).json({message: 'post deleted'});
        }catch{
            res.status(400).json({message: err});
        }
    }                
    )}


  exports.getPost = (req, res, next) => {
        const postId = req.params.id;
    const sql = `SELECT *
                 FROM uploads 
                 WHERE uploads.id = ${postId}`;
    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(200).json(results);
        }catch{
            res.status(400).json({message: err});
        }
    })
  }

  
  exports.createPost = (req, res, next) => {
   
    const author = req.body.author;
    //const content = req.body.content;
    const title = req.body.title;
    //const author = '2';
    // const content = 'working on multer2';
    //const title = 'multer3';
    //console.log(req.file)
    console.log(req)
    const url = req.protocol + '://' + req.get('host');
    const content = url + '/images/' + req.file.filename;

    const sql = `INSERT INTO uploads (content, author, title)
                VALUES ('${content}', '${author}', '${title}')`;

    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(201).json({message: 'posted successfully3'})
        }catch{
            res.status(400).json({message: err});
        }
    })
  }

  exports.likePost = (req, res, next) => {
    const postId = req.body.uploadId;
    const userId = req.body.userId;
    const sql = `INSERT INTO likes (idUser, idUpload, liked)
                VALUES (${userId}, ${postId}, '1')`;
    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(200).json({message: 'liked successfully'})
        }catch{
            res.status(400).json({message: err});
        }
    })
  }

  


  exports.updatePost = (req, res, next) => {
    //console.log(req.body)
    //console.log(req.file)
    // console.log('title' + req.body.title)
    // console.log('content' + req.body.gif)
   
    const postId = req.params.id;
    const title = req.body.title;
    console.log(!req.file)
    console.log('title' + req.body.title)

    
    if(!req.file){
        const sql = `UPDATE uploads
        SET title ='${title}'
        WHERE uploads.id = '${postId}'`;

        db.query(sql, async (err, results)=> {
            try{
                const post =await res.status(201).json({message: 'updated successfully'});
            }catch{
                res.status(400).json({message: err});
            }
        })
    }
    else{
        const url = req.protocol + '://' + req.get('host');
        const content = url + '/images/' + req.file.filename;
        const sql = `UPDATE uploads
        SET content = '${content}', title ='${title}'
        WHERE uploads.id = '${postId}'`;

        db.query(sql, async (err, results)=> {
            try{
                const post =await res.status(201).json({message: 'updated successfully'});
            }catch{
                res.status(400).json({message: err});
            }
        })
    }

    // const url = req.protocol + '://' + req.get('host');
    // const content = url + '/images/' + req.file.filename;
   
   
   
    
  }

  exports.getLikes = (req, res, next)=>{
    let sql = `SELECT users.name FROM likes INNER JOIN users ON likes.idUser = users.id WHERE idUpload = '${req.params.id}'`;
    // let sql = `SELECT * FROM likes WHERE idUpload = '${req.params.id}'`;
    db.query(sql, async (err, results)=> {
        try{
            const allPosts = await res.status(200).json(results);
        }catch{
            res.status(400).json({message: err});
        }
    })
}

  
