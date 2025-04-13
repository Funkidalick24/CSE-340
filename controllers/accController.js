const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");// Changed from bcrypt to bcryptjs
require("dotenv").config();

const accController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin  (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: res.locals.messages,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: res.locals.messages
      })
    }

    const passwordMatch = await bcryptjs.compare(account_password, accountData.account_password)

    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000 
      })
      return res.redirect("/account/management")
    }

    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;
    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    );

    if (result.rowCount > 0) {
      req.flash(
        "success",
        `Congratulations, ${account_firstname}, you're registered! Please log in.`,
      );
      return res.redirect("/account/login");
    } else {
      req.flash("error", "Registration failed.");
      let nav = await utilities.getNav();
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: res.locals.messages,
      });
    }
  } catch (error) {
    console.error("Error in registerAccount controller:", error);
    next(error);
  }
};

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountData = res.locals.accountData;

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData,
      messages: res.locals.messages,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accountModel.updateAccount({
    account_firstname,
    account_lastname,
    account_email,
    account_id
  })

  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/management")
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.redirect("/account/update/" + account_id)
  }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function updatePassword(req, res, next) {
  const { account_password, account_id } = req.body
  let hashedPassword = await bcryptjs.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/management")
  } else {
    req.flash("notice", "Password update failed. Please try again.")
    res.redirect("/account/update/" + account_id)
  }
}

/* ****************************************
*  Process Logout
* *************************************** */
async function logoutAccount(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  accountLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  buildAccountUpdate,
  updateAccount,
  updatePassword,
  logoutAccount
};
