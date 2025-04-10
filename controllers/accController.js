const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs") // Changed from bcrypt to bcryptjs
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
    const { account_email, account_password } = req.body
    
    if (!account_email || !account_password) {
      req.flash("notice", "Please provide both email and password")
      let nav = await utilities.getNav()
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: res.locals.messages,
      })
    }

    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      let nav = await utilities.getNav()
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: res.locals.messages,
      })
    }

    const passwordMatch = await bcryptjs.compare(account_password, accountData.account_password)

    if (passwordMatch) {
      delete accountData.account_password
      req.session.accountData = accountData
      res.locals.accountData = accountData
      req.flash("success", "Logged in successfully")
      return res.redirect("/account")
    }

    req.flash("notice", "Please check your credentials and try again.")
    let nav = await utilities.getNav()
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: res.locals.messages,
    })

  } catch (error) {
    console.error("Login error:", error)
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
*  Deliver account management view
* *************************************** */
accController.buildAccountManagement = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData
    
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

module.exports = accController
