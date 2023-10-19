const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Model/User');
const { formatDistance } = require('date-fns');

const handleLogin = async (req, res) => {
    const cookies = req.cookies
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = await User.findOne({username: user}).exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const newRefreshTokenArray =  
            !cookies?.jwt
                ?foundUsers.refreshToken
                :foundUsers.refreshToken.filter(rt => rt !== cookies.jwt)

            if(cookies) res.clearCookie("jwt", { httpOnly: true, sameSite: 'None',/* secure: true */ });   
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = await foundUser.save();
            console.log(result);       
             
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //secure: true, 
            res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };