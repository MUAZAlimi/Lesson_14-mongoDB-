const express = require("express");
const router = express.Router();
const registerController = require("../Controllers/registerControllers");

router.post("/", registerController.handleNewUser);

module.exports = router;
