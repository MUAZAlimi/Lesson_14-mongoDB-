const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 4700;

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

//Static Routes
app.use('/', express.static(path.join(__dirname, "public")));               //Apply static files
app.use(logger)
app.use(cors(corsOptions))

 
//Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'));
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/logout', require('./routes/logout'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({"error": "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found")
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

 