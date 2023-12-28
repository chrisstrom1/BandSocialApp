let db = require("../utils/db");
let argon2 = require("argon2");
let jsonwebtoken = require("jsonwebtoken");


let register = async function(req, res){

    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    if(!email || !password){
        res.status(400).json("email and password are required");
        return;
    }


let passwordHash;
    try{
 passwordHash = await argon2.hash(password);

} catch(error){
    console.error("failed to hash password", error);
    res.sendStatus(500);
    return
}

let sql = "INSERT INTO users(email, password_hash, name) VALUES (? , ? , ?)";
let params = [email,passwordHash,name];

db.query(sql, params, function(error, results){
    if(error){
        console.error("Failed to save user info", error);
        res.sendStatus(500);
        return;
    }else {
    res.status(200).jason("User registered");
    return;
     }
    
    
    });
}    
let login = function(req, res){

let email = req.body.email;
let password = req.body.password;
if(!email || !password){
    res.status(400).json("email and password are required");
    return;
}

let sql = "SELECT id, password_hash FROM users WHERE email = ?";
let params = [email];
 

    db.query(sql, params, async function(error, results){
        if(error){
            console.error("Failed to fetch user info for login, error");
            res.sendStatus(500);
            return;
        } else if(results.length > 1) {
            console.error("found more than 1 row for email");
            res.sendStatus(500);
            return;
        } else if (results.length == 0) {
            res.sendStatus(401);
         } else {
            let userid = results[0].id;
            let hash = results[0].password_hash;

            let passwordMatch = false;
            try{
                passwordMatch = await argon2.verify(hash, password);
            } catch(error){
                console.error("Failed to verify password hash", error);
        }
          if(passwordMatch){
            let token = {
                userid, userid,
                email, email,
            };
            let signedToken = jsonwebtoken.sign(token, process.env.JWT_SECRET, {expiresIn: "1 day"});
            res.json(signedToken);
            return;

        } else {
            res.sendStatus(401);
            return;
        }
        }
          
    
    
const listAll = function(req,res){
    // This is the query to the databse
    // SQL: Select id, first_name, last_name FROM users
    
        db.query("SELECT id, first_name, last_name FROM users", function(err, results){
            if(err){
                console.log("Failed to fetch users from the database", err)
                res.sendStatus(500)
            } else {
                res.json(results)
            }
        })
    }
    
    const showSpecific = function(req,res){
    // This is the query to fetch a specific user based on the path params   
    // SQL: SELECT id, first_name, last_name FROM users WHERE id = ?
    
        // This is to store the changing ID variable
        let id = req.params.id
    
        // This is to help prevent SQL injection
        let sqlCommand = "SELECT id, first_name, last_name FROM users WHERE id = ?"
        let params = [id]
    
        db.query(sqlCommand, params, function(err, results){
            if(err){
                console.log("Failed to fetch user from the database", err)
                res.sendStatus(500)
            } else {
                // res.json(results)
                if(results.length == 0){
                    res.json(null)
                } else {
                    res.json(results[0])
                }
            }
        })
    
    }
    
    const createNew = function(req,res){
    // This is the command to create a new user in the USERS table
    // SQL: INSERT INTO users(first_name, last_name, employment_status, age) VALUES ("first_name", "last_name", true, 18)
    
        // This is to understand what was sent in the Request Body
        let f_name = req.body.first_name
        let l_name = req.body.last_name
        let e_status = req.body.employment_status
        let user_age = req.body.age
    
        // This is to help prevent SQL injection
        let sqlCommand = "INSERT INTO users(first_name, last_name, employment_status, age) VALUES (?, ?, ?, ?)"
        let params = [f_name, l_name, e_status, user_age]
    
        db.query(sqlCommand, params, function(err, results){
            if(err){
                console.log("Failed to fetch users from the database", err)
                res.sendStatus(500)
            } else {
                res.sendStatus(202)
            }
        })
    }
    
    const updateExisting = function(req,res){
    // This is the command to update an existing user in the USERS table
    // SQL: UPDATE users where id = ?
    
        // This is to understand what was sent in the Request Body
        let f_name = req.body.first_name
        let l_name = req.body.last_name
        let e_status = req.body.employment_status
        let user_age = req.body.age
    
        let id = req.params.id
    
        // This is to help prevent SQL injection
        let sqlCommand = "UPDATE users SET first_name = ?, last_name = ?, employment_status = ?, age = ? where id = ?"
        let params = [f_name, l_name, e_status, user_age, id]
    
        db.query(sqlCommand, params, function(err, results){
            if(err){
                console.log("Failed to update user", err)
                res.sendStatus(500)
            } else {
                res.sendStatus(200)
            }
        })
    }
    
    const deleteUser = function(req,res){
    // This is the command to delete an existing user in the USERS table
    // SQL: DELETE users where id = ?
    
        // This is to prevent SQL injection
        let id = req.params.id
        let params = [id]
        let sqlCommand = "DELETE from users where id = ?"
    
        db.query(sqlCommand, params, function(err, results){
            if(err){
                console.log("Failed to delete user", err)
                res.sendStatus(500)
            } else {
                res.sendStatus(200)
            }
        })
    }
       
    });


}
module.exports = {
    login, register , listAll, showSpecific, createNew, updateExisting, deleteUser
}

