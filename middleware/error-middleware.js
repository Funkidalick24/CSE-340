const utilities = require("../utilities");

const errorMiddleware = {
  // Log error
  logError: (err, req, res, next) => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    next(err);
  },

  // Handle error
  handleError: async (err, req, res, next) => {
    let nav = await utilities.getNav();
    console.error(`Error: ${err.message}`);
    res.render("errors/error", {
      title: err.status ? "Error " + err.status : "Server Error",
      message: err.message,
      nav,
      errors: null,
    });
  },

  // Trigger 500 error for testing
  trigger500Error: (req, res, next) => {
    let err = new Error("Intentional 500 error");
    err.status = 500;
    next(err);
  },
};

module.exports = errorMiddleware;
