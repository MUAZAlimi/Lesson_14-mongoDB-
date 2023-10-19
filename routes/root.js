const express = require('express')
const router = express.Router()
const path = require('path')
// const router = require('./subdir')
 
router.get('^/$|/index(.html)?', (req, res) => {                        //Makes it dynamic to either use .html or not in our address
    res.sendFile(path.join(__dirname, '..', "views", "index.html"))
})

module.exports = router