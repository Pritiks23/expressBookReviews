// const express = require('express');
// const jwt = require('jsonwebtoken');
// const session = require('express-session')
// const customer_routes = require('./router/auth_users.js').authenticated;
// const genl_routes = require('./router/general.js').general;

// const app = express();

// app.use(express.json());

// app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// app.use("/customer/auth/*", function auth(req,res,next){
// //Write the authenication mechanism here
// });
 
// const PORT =5000;

// app.use("/customer", customer_routes);
// app.use("/", genl_routes);

// app.listen(PORT,()=>console.log("Server is running"));

// index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for customer routes
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// Authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if a session token exists
  const token = req.session.authorization?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Verify JWT token
  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    } else {
      // Token is valid, attach user info to request object
      req.user = decoded;
      next(); // Proceed to the requested route
    }
  });
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
