const { AccessToken } = require("./../models/AccessToken");

const middleware = app => {
  app.use(async (req, res, next) => {
    // To authenticate the request url.
    if (req.url.indexOf("/api/public") == -1) {
      var token = req.header("x-auth");
      if (!token) return res.status(400).send();
      try {
        req.admin = await AccessToken.findByToken(token);
        req.token = token;
        next();
      } catch (err) {
        req.body.token = token;
        return res.status(401).send();
      }
    } else {
      if (req.url.indexOf("api/public/adminLogin") !== -1) {
        if (!req.body.mail || !req.body.password) {
          return res.status(400).send();
        }
      }
      next();
    }
  });

  app.use("/api/public", require("../routes/publicRoutes"));
  app.use("/api", require("../routes/authRoutes"));
  app.use("/api", require("../routes/router"));
  app.use("/api", require("../routes/imageRoute"));
};

module.exports = { middleware };
