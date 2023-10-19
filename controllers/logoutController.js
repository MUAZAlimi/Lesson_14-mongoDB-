const User = require('../Model/User');

const handleLogout = async (req, res) => {
  // onclient also delets accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //no content
  //   is refreshtoken in database

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({refreshToken}).exec()
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None',/* secure: true */ });
    return res.sendStatus(204);
  }
  // delete refresh token in  database
  foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken)
  const result = await foundUser.save();
  console.log(result)
  
  res.clearCookie("jwt", { httpOnly: true, sameSite: 'None',/* secure: true */ });
  res.sendStatus(204);
};

module.exports = { handleLogout };
