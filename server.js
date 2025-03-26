/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const errorRoute = require("./routes/errorRoute")
const errorMiddleware = require("./middleware/error-middleware")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use(express.static('public'))

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Remove views/ from the path

app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Route usage
app.use("/error", errorRoute)

// Error handling middleware - must be last
app.use(errorMiddleware.logError)
app.use(errorMiddleware.handleError)

// Catch 404 and forward to error handler
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
