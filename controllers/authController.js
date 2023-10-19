const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
  }
  const bcrypt = require('bcrypt');
  
  const jwt = require('jsonwebtoken');
  require('dotenv').config();
  const fsPromises = require('fs').promises;
  const path = require('path');
  
  const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); //.json({"message": "Invalid username or password"}) //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles)
        // create JWTs
        const accessToken = jwt.sign(
            {
                "userInfo" : {
                    "username": foundUser.username,
                    "roles" : roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );
        const role = Object.values(foundUser.roles)
        const refreshToken = jwt.sign(
            { 
                "userInfo" : {
                    "username": jwt.decode.username,
                    "roles" : role
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
  }
  
  module.exports = { handleLogin };












// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// };

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken")
//     require("dotenv").config()
// const fsPromise = require("fs").promises
// const path = require("path")

// const handleLogin = async (req, res) => {
//     const { user, pwd } = req.body;
//     if (!user || !pwd) return res.status(400).json({"message": "Invalid username or password"})
//     const foundUser = usersDB.users.find(person => person.username  === user)
//     if(!foundUser) return res.sendStatus(401) 
    
//     //evaluate password
//     const match = await bcrypt.compare(pwd, foundUser.password)
//         if(match) {
//             //create jwt
//             const accessToken = jwt.sign(
//                 {"username": foundUser.username},
//                 process.env.ACCESS_TOKEN_SECRET,
//                 {expiresIn: "60s"}
//             )

//             const refreshToken = jwt.sign(
//                 {"username": foundUser.username},
//                 process.env.REFRESH_TOKEN_SECRET,
//                 {expiresIn: "1d"}
//             )
//             //Saving the refreshToken with current user
//             const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
//             const currentUser = {...foundUser, refreshToken}
//             // console.log(currentUser);
//             usersDB.setUsers([...otherUsers, currentUser])
//             await fsPromise.writeFile(
//                 path.join(__dirname, "..", "model", "users.json"),
//                 JSON.stringify(usersDB.users)
//             )
//             res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
//             res.json({accessToken})
//         } else {
//             res.sendStatus(401)
//         }
// }

// module.exports = {handleLogin}