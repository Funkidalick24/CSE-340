const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const validate = require('../utilities/account-validation')
const accController = require("../controllers/accController")

// Add the default route for account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accController.loginAccount)
)

// Add management route
router.get("/management", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement))

// Registration routes
router.get("/register", utilities.handleErrors(accController.buildRegister))

router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
)

// Logout route
router.get("/logout", (req, res) => {
  res.send("Logout Page")
})

// Password management routes
router.get("/forgot-password", (req, res) => {
  res.send("Forgot Password Page")
})

router.get("/reset-password", (req, res) => {
  res.send("Reset Password Page")
})

// Profile route
router.get("/profile", (req, res) => {
  res.send("Profile Page")
})

module.exports = router