/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute");
const errorMiddleware = require("./middleware/error-middleware");
const session = require("express-session");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities/");
const flash = require("connect-flash");

/* ***********************
 * Middleware
 *************************/
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(utilities.checkJWTToken);

// Static Routes
app.use(static);
app.use(express.static("public"));

// Session Middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
    cookie: {
      secure: true,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

// Flash Message Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages = () => {
    const messages = req.flash();
    const messageTypes = Object.keys(messages);
    let messagesList = [];
    messageTypes.forEach((type) => {
      messages[type].forEach((message) => {
        messagesList.push(
          `<div class='flash-message ${type}'>${message}</div>`,
        );
      });
    });
    return messagesList.length ? messagesList.join("") : null;
  };
  next();
});

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Remove views/ from the path

app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Route usage
app.use("/error", errorRoute);

// Error handling middleware - must be last
app.use(errorMiddleware.logError);
app.use(errorMiddleware.handleError);

// Catch 404 and forward to error handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
