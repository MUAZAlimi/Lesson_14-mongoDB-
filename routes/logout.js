const express = require("express");
const router = express.Router();
const logOutController = require("../Controllers/logOutController");

router.get("/", logOutController.handleLogout);

module.exports = router;
