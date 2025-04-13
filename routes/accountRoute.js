const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");

const accountController = require("../controllers/accController");
const {
  buildLogin,
  accountLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  buildAccountUpdate
} = require("../controllers/accController");

// Add the default route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(buildAccountManagement),
);

// Route to build login view
router.get("/login", utilities.handleErrors(buildLogin));

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountLogin),
);

// Add management route
router.get(
  "/management",
  utilities.checkLogin,
  utilities.handleErrors(buildAccountManagement),
);

// Registration routes
router.get("/register", utilities.handleErrors(buildRegister));

router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(registerAccount),
);

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));




// Route to build the account update view
router.get("/update/:accountId", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Account update routes
router.post("/update",
  utilities.checkLogin,
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post("/update-password",
  utilities.checkLogin,
  validate.passwordRules(),
  validate.checkPassword,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
