const express = require("express");
const router = express.Router();
const services = require("../urban_clap_services.json");
// TOKEN DOES NOT HOLD ANY DATA (JWT SHOULD BE USED)

let users = [
  {
    email: "paras@nagarro.com",
    password: "paras123",
    token: "534570daf5c5363ff0498b702d981bac729a8f51",
  },
];
// DATA FOR USERS WHO REQUESTED A SERVICE
let requested_services = [];
// AUTHENTICATION
const authenticate = (req, res, next) => {
  const token = req.token;
  users.map((user) => {
    if (token == user.token) {
      next();
    } else {
      res.send({ message: "unauthorized" }).status(401);
    }
  });
};
/* GET users listing. */
router.get("/user", function (req, res, next) {
  res.send("respond with a resource");
});

// SIGNUP
router.post("/signup", (req, res, next) => {
  let current_date = new Date().valueOf().toString();
  let random = Math.random().toString();
  let token = crypto
    .createHash("sha1")
    .update(current_date + random)
    .digest("hex");

  let user_details = {
    name: req.body.first_name,
    email: req.body.email,
    password: req.body.password,
    token: token,
  };
  users.push(user_details);
  res.send({ message: "user signed in", token: token });
});

// LOGIN
router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  users.map((user) => {
    if (user.email == email && user.password == password) {
      let current_date = new Date().valueOf().toString();
      let random = Math.random().toString();
      let token = crypto
        .createHash("sha1")
        .update(current_date + random)
        .digest("hex");
      user.token = token;
      res.send({ message: "you have logged in", token: token });
    } else {
      res.send({
        message: "either user does not exist or password/email mismatch",
      });
    }
  });
});

// GET SERVICES
router.get("/services", authenticate, (req, res, next) => {
  res.send({
    message: "hello, you can request from the follwing services",
    data: services,
  });
});

// APPLY FOR A SERVICE
router.post("/service", authenticate, (req, res, next) => {
  let requested_user_service = req.body.service;
  let service_name = services[requested_user_service];
  users.map((user) => {
    if (user.token == req.body.token) {
      let add_user_service = {
        email: user.email,
        type: "requested",
        service_name: service_name,
      };
      // THIS LIST NOW GOES TO THE ADMIN FOR VERIFICATION
      requested_services.push(add_user_service);
    }
  });
});

module.exports = router;

// AUTHENTICATOR SERVICE
