const express = require("express");
var app = express();
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
require("./config/config");

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5005;
// configuration ===============================================================
require("./services/db/mongoose");
require("./services/passport");

app.use(
  cookieSession({
    name: "srf",
    maxAge: 2592000000, // 2592000000 = 30 * 24 * 60 * 60 * 1000
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

const { middleware } = require("./controller/filter");
middleware(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Started up at port ${PORT}`);
});
