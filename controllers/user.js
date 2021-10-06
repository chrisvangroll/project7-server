const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv/config');

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: process.env.DB_PASSWORD,
    database: 'groupomania'
  })
    
exports.signup =  (req, res, next) =>{
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    bcrypt.hash(password, 10, (err, hash)=>{
        const sql = `INSERT INTO users (name, email, password)
                    VALUES ('${name}', '${email}', '${hash}');`
        db.query(sql, async (err, results)=>{
            try{
                const post =await results;

                const sqlTwo = `SELECT id
                               FROM users
                               WHERE email = '${email}'`
                    
                    db.query(sqlTwo, async (err, results)=>{
                        try{
                            const post =await results;
                            const token = jwt.sign(
                                { userId: results[0].id },
                                process.env.JWT_KEY,
                                { expiresIn: '24h' });
                            res.status(201).json(
                                {message: 'signup successful', 
                                userId : results[0].id, 
                                token: token})
                            
                        }catch{
                            res.status(400).json({message: err});
                        }
                    })
            }catch{
                res.status(400).json({message: err});
            }
        })
    }) 
}


  exports.login = async(req, res, next) =>{
    const password = req.body.password;
    const email = req.body.email;
    const sql = `SELECT id, email, password
                 FROM users
                 WHERE email = '${email}'`;
    try{
        db.query(sql, async (err, results)=>{
            try{
                 const post = await (results);

                 if(results.length > 0){
                    const comparison = await bcrypt.compare(password, results[0].password);

                    if(comparison){
                        const token = jwt.sign(
                            { userId: results[0].id },
                            process.env.JWT_KEY,
                            { expiresIn: '24h' });
                        res.status(200).json(
                            {message: 'login successful', 
                            userId : results[0].id, 
                            token: token})
                    }else{
                       res.status(200).json({message: 'Email and password do not match'})
                    }
                 }else{
                    res.status(206).json({message: 'Email does not exist'})
                 }
                
            }catch{
                res.status(400).json({message: err});
            } 
        })
    }catch{
        res.status(400).json({message: err});
    }
     
  }

  exports.deleteUser = (req, res, next) => {
    const userId = req.body.userId;
    const sql =    `DELETE from users
                    WHERE id = '${userId}'`

    db.query(sql, async (err, results)=> {
        try{
            const post =await res.status(200).json({message: 'user deleted'});
        }catch{
            res.status(400).json({message: err});
        }
    }                
    )}
  // exports.login = (req, res, next) => {
  //   User.findOne({ email: req.body.email }).then(
  //     (user) => {
  //       if (!user) {
  //         return res.status(401).json({
  //           error: new Error('User not found!')
  //         });
  //       }
  //       bcrypt.compare(req.body.password, user.password).then(
  //         (valid) => {
  //           if (!valid) {
  //             return res.status(401).json({
  //               error: new Error('Incorrect password!')
  //             });
  //           }
  //           const token = jwt.sign(
  //             { userId: user._id },
  //             'RANDOM_TOKEN_SECRET',
  //             { expiresIn: '24h' });
  //           res.status(200).json({
  //             userId: user._id,
  //             token: token
  //           });
  //         }
  //       ).catch(
  //         (error) => {
  //           res.status(500).json({
  //             error: error
  //           });
  //         }
  //       );
  //     }
  //   ).catch(
  //     (error) => {
  //       res.status(500).json({
  //         error: error
  //       });
  //     }
  //   );
  // }