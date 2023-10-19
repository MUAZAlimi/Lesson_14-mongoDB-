const bcrypt = require("bcrypt");
const User = require("../Model/User");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res.status(400).json({ message: "username and password required" });

    const duplicate = await User.findOne({username : user}).exec();
    if (duplicate) return res.sendStatus(409) // conflict

  try {
    // ENCRYPT THE PASSWORD
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // STORE THE NEW USER
    const result = await User.create({
      username : user,
      password : hashedPwd
    })
    console.log(result)


    res.status(201).json({ success: `New User ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
