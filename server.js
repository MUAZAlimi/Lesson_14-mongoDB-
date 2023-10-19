require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const corsOptions = require("./Config/corsOption");
const { logger } = require("./Middleware/logEvents");
const errorHandler = require("./Middleware/errHandler");
const verifyJWT = require("./Middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credential = require("./Middleware/credential")
const mongoose = require("mongoose")
const connectDb = require('./Config/dbConn')

connectDb()
const PORT = process.env.PORT || 4900;

// BIULT IN
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// STATIC ROUTES
app.use("/", express.static(path.join(__dirname, "public")));

app.use(logger);

app.use(credential)

app.use(cors(corsOptions));

// app.get("/", (req, res) => {
//   res.sendFile("/views/index.html", { root: __dirname });
// });

// The OTHER METHOD WE CAN USE TO GET ROUTE

// app.get("/",(req,res) =>{
//   res.sendFile(path.join(__dirname, "views","index.html"))
// })

//ALTERNATIVE METHOD TO CREATE A ROUTE

// ALTERNATIVE METHOD
// app.get("/testing(.html)?" , (req,res) =>{
//   res.redirect(301, "new-page.html")})

// ROUTES
app.use("/", require("./Routes/root"));
app.use("/register", require("./Routes/register"));
app.use("/auth", require("./Routes/auth"));
app.use("/refresh", require("./Routes/refresh"));
app.use(verifyJWT);
app.use("/employees", require("./Routes/api/employees"));
app.use("/logOut", require("./Routes/logOut"));

// APP.ALL IS THE ROUTE HANDLER FOR ALL REQUESTS
app.all("*", (req, res) => {
  res.status(404); // It sets the response status to 404 using the  res.status  method.
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html")); // If the request accepts HTML, it sends a file named "404.html" using the  res.sendFile  method.
    //The file is located in the "views" directory, which is resolved using the  path.join  method.
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" }); //  If the request accepts JSON, it sends a JSON object with an error message using the  res.json  method.
  } else {
    res.type("txt").send("404 not Found"); // . If the request does not accept HTML or JSON, it sets the response content type to plain text using the  res.type  method and sends the message "404 not Found" using the  res.send  method.
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB 🎊🎉🥳❤️')
  app.listen(PORT, () => {console.log(`server is running on port ${PORT}`);});
})
