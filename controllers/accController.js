const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
 *  Process login request
 * ************************************ */
accController.loginAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: res.locals.messages,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      req.session.accountData = accountData
      res.locals.loggedin = 1
      res.locals.accountData = accountData
      req.flash("success", "You're logged in!")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: res.locals.messages,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accController.buildAccountManagement = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: res.locals.accountData,
      messages: res.locals.messages,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = accController
