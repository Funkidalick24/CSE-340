const utilities = require("../utilities/")

const baseController = {
  async buildHome(req, res, next) {
    try {
      const nav = await utilities.getNav()
      res.render("index", {
        title: "Home",
        nav,
        errors: null,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = baseController