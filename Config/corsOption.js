const whiteList = [
  "https://www.yourdomain.com",
  "http://127.0.0.1:3100",
  "http://localhost:3000",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORs"));
    }
  },
  optionSuccessStatus: 200,
};


module.exports = corsOptions