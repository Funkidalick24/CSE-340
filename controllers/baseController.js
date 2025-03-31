const utilities = require("../utilities/")

const baseController = {
  async buildHome(req, res, next) {
    try {
      const nav = await utilities.getNav()
      req.flash("notice", "This is a flash message.")
      res.render("index", {
        title: "Home",
        nav,
        errors: null,
        messages: res.locals.messages
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = baseController