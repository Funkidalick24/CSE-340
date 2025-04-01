const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const accController = require("../controllers/accController")

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin))

// Process the login attempt
router.post("/login", utilities.handleErrors(accController.loginAccount))

// Registration routes
router.get("/register", utilities.handleErrors(accController.buildRegister))

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
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