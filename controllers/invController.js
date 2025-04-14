const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ****************************************
 *  Build vehicle by invId 
 * *************************************** */
async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicle = await invModel.getVehicleById(inv_id)

    if (vehicle) {
      let nav = await utilities.getNav()
      const vehicleDetail = await utilities.buildVehicleDetail(vehicle)
      res.render("./inventory/detail", {
        title: vehicle.inv_make + ' ' + vehicle.inv_model,
        nav,
        detail: vehicleDetail,  // Changed from grid to detail
        vehicleData: vehicle,
        errors: null
      })
    } else {
      const vehicleDetail = await utilities.buildVehicleDetail({})
      let nav = await utilities.getNav()
      req.flash("notice", "Sorry, we could not find that vehicle")
      res.status(404).render("./inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        detail: vehicleDetail,  // Changed from grid to detail
        errors: null
      })
    }
  } catch (error) {
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: res.locals.messages,
    });
  } catch (error) {
    next(error);
  }
};

invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result.rowCount > 0) {
      req.flash("success", "Classification added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add classification.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: res.locals.messages,
    });
  } catch (error) {
    next(error);
  }
};

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
      inv_color,
    } = req.body;

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
      inv_color,
    );

    if (result.rowCount > 0) {
      req.flash("success", "Vehicle added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add vehicle.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error in addInventory:", error);
    next(error);
  }
};

/* ****************************************
 *  Build management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationList,
      messages: res.locals.messages,
    });
  } catch (error) {
    next(error);
  }
};
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("success", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("error", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        messages: res.locals.messages
      })
    }
  } catch (error) {
    console.error("Error in updateInventory:", error)
    next(error)
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      messages: res.locals.messages
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process delete inventory request
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventory(inv_id)
    
    if (deleteResult.rowCount > 0) {
      req.flash("success", "Vehicle was successfully deleted")
      res.redirect("/inv/")
    } else {
      req.flash("error", "Delete failed")
      res.redirect("/inv/delete/" + inv_id)
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Build Vehicle Comparison View
 * *************************************** */
const buildComparisonView = async (req, res) => {
  try {
    const vehicles = []
    const compareList = req.session.compareList || []
    let nav = await utilities.getNav()

    // Get vehicle data for each ID in compare list
    for (const id of compareList) {
      const vehicle = await invModel.getVehicleById(id)
      if (vehicle) {
        vehicles.push(vehicle)
      }
    }

    // If no vehicles, redirect
    if (!vehicles.length) {
      req.flash("notice", "No vehicles selected for comparison")
      return res.redirect("/inv")
    }

    res.render("./inventory/compare", {
      title: "Vehicle Comparison",
      nav,
      vehicles,
      errors: null
    })
  } catch (error) {
    req.flash("notice", "Error building comparison view")
    res.redirect("/inv")
  }
}

/* ****************************************
 *  Add Vehicle to Comparison
 * *************************************** */
const addToCompare = async (req, res) => {
  try {
    const { inv_id } = req.params

    if (!req.session.compareList) {
      req.session.compareList = []
    }

    if (req.session.compareList.length >= 3) {
      return res.json({ 
        error: "Can only compare up to 3 vehicles" 
      })
    }

    if (!req.session.compareList.includes(inv_id)) {
      req.session.compareList.push(inv_id)
    }

    const vehicles = await Promise.all(
      req.session.compareList.map(id => invModel.getVehicleById(id))
    )

    res.json({ vehicles })
  } catch (error) {
    res.json({ error: "Error adding vehicle to comparison" })
  }
}

/* ****************************************
 *  Get all vehicles
 * *************************************** */
async function getAllVehicles(req, res) {
  try {
    const vehicles = await invModel.getAllVehicles()
    console.log("Vehicles fetched:", vehicles.length)
    res.json({ vehicles })
  } catch (error) {
    console.error("getAllVehicles error:", error)
    res.json({ vehicles: [] })
  }
}

/* ****************************************
 *  Get vehicle by ID
 * *************************************** */
async function getVehicleById(req, res) {
  try {
    const vehicle = await invModel.getVehicleById(req.params.id)
    console.log("Vehicle data fetched:", vehicle)
    res.json({ vehicle })
  } catch (error) {
    console.error("getVehicleById error:", error)
    res.json({ vehicle: null })
  }
}

/* ***************************
 * Build comparison view
 * ************************** */
async function buildComparison(req, res) {
    try {
        let nav = await utilities.getNav()
        const vehicles = await invModel.getAllVehicles()
        const preSelectedId = req.query.vehicle1
        const returnId = req.query.returnId
        
        console.log("Return ID:", returnId) // Debug log
        
        res.render("./inventory/compare", {
            title: "Compare Vehicles",
            nav,
            vehicles,
            preSelectedId,
            returnId: parseInt(returnId), // Ensure returnId is a number
            errors: null
        })
    } catch (error) {
        console.error("Error building comparison view:", error)
        req.flash("notice", "Error loading comparison page")
        res.redirect("/")
    }
}

// Add to module exports
module.exports = {
  ...invCont,
  buildComparisonView,
  addToCompare,
  buildByInventoryId,
  getAllVehicles,
  getVehicleById,
  buildComparison
}
