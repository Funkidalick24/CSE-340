const utilities = require("../utilities")
const accountModel = require("../models/account-model")

const accController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accController.buildLogin = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process login attempt
* *************************************** */
accController.loginAccount = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accController.buildRegister = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accController.registerAccount = async function(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const result = await accountModel.registerAccount(
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password
    )
    
    if (result.rowCount > 0) {
      req.flash("success", `Congratulations, ${account_firstname}, you're registered! Please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("error", "Registration failed.")
      let nav = await utilities.getNav()
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: res.locals.messages
      })
    }
  } catch (error) {
    console.error("Error in registerAccount controller:", error)
    next(error)
  }
}

module.exports = accController
