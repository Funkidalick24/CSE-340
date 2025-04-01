const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getVehicleById(inv_id)
    const detail = utilities.buildVehicleDetail(vehicleData)
    let nav = await utilities.getNav()
    const title = `${vehicleData.inv_make} ${vehicleData.inv_model}`
    res.render("./inventory/detail", {
      title,
      nav,
      detail,
      errors: null,
    })
  } catch (error) {
    console.error("buildByInventoryId error: " + error)
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: res.locals.messages,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result.rowCount > 0) {
      req.flash("success", "Classification added successfully.")
      return res.redirect("/inv")
    } else {
      req.flash("error", "Failed to add classification.")
      return res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: res.locals.messages,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )

    if (result.rowCount > 0) {
      req.flash("success", "Vehicle added successfully.")
      return res.redirect("/inv")
    } else {
      req.flash("error", "Failed to add vehicle.")
      return res.redirect("/inv/add-inventory")
    }
  } catch (error) {
    console.error("Error in addInventory:", error)
    next(error)
  }
}

/* ****************************************
*  Build management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont