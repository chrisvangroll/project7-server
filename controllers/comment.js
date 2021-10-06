const mysql = require('mysql');
require('dotenv/config');

const db = mysql.createConnection({
      user: 'root',
      host: 'localhost',
      password: process.env.DB_PASSWORD,
      database: 'groupomania'
    })

exports.createComment = (req, res, next) => {
    const commenter = req.body.userId;
    const uploadId = req.body.uploadId;
    const comment = req.body.content;
    
    const sql = `INSERT INTO comments (commenter, uploadId, comment)
                VALUES ('${commenter}', ${uploadId}, '${comment}')`;
    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(201).json({message: 'commented successfully'})
        }catch{
            res.status(400).json({message: err});
        }
    })
  }

  exports.getComments = (req, res, next)=>{
      const uploadId = req.params.id;
    let sql = `SELECT comments.id, comments.commenter, comments.uploadId, comments.comment, users.name FROM comments INNER JOIN users ON comments.commenter = users.id WHERE uploadId = '${uploadId}'`;
    db.query(sql, async (err, results)=> {
        try{
            const allPosts = res.send(results)
            
        }catch{
            res.status(400).json({message: err});
        }
    })
}

  exports.deleteComment = (req, res, next) => {
    const commentId = req.params.id;
    const sql =    `DELETE from comments
                    WHERE id = '${commentId}'`
    db.query(sql, (err, results)=> {
        if(!err){
            res.send('Comment Deleted');
        }
        else{
            console.log(err);
        }
    }
    )}

    exports.updateComment = (req, res, next) => {
        const commentId = req.body.id;
        const comment = req.body.comment;
        const sql = `UPDATE comments
                     SET comment = '${comment}'
                     WHERE comments.id = '${commentId}'`;
        db.query(sql, async (err, results)=> {
            try{
                const post =await res.send('comment updated1')
            }catch{
                res.status(400).json({message: err});
            }
        })
      }

      exports.likeComment = (req, res, next) => {
       
        const commentId = req.body.commentId;
        const userId = req.body.userId;

        const sql = `INSERT INTO comment_likes (userId, commentId, liked)
                    VALUES (${userId}, ${commentId}, '1')`;
        db.query(sql, async (err, results)=> {
            try{
                const post =await res.send('liked successfuly')
            }catch{
                res.status(400).json({message: err});
            }
        })
      }

      exports.getCommentLikes = (req, res, next)=>{
        let sql = `SELECT users.name FROM comment_likes INNER JOIN users ON comment_likes.userId = users.id WHERE commentId = '${req.params.id}'`;
        // let sql = `SELECT * FROM comment_likes WHERE commentId = '${req.params.id}'`;
        db.query(sql, async (err, results)=> {
            try{
                const allPosts = await res.status(200).json(results);
            }catch{
                res.status(400).json({message: err});
            }
        })
    }
    
    