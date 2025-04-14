// Needed Resources
const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

// Public routes - no auth needed
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId),
);

router.get("/vehicles", 
  utilities.handleErrors(invController.getAllVehicles)
);

router.get("/vehicle/:id", 
  utilities.handleErrors(invController.getVehicleById)
);

// Protected management routes
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.buildManagement),
);

router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.buildAddClassification),
);
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.buildAddInventory),
);
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON),
);

// Route to build edit inventory view
router.get(
  "/edit/:invId",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.buildEditInventory),
);

router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  invValidate.inventoryRules(),
  invValidate.updateInventoryData,
  invController.updateInventory,
);

// Delete confirmation route
router.get(
  "/delete/:invId",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.buildDeleteView),
);

// Process delete
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAdminAuthorization,
  utilities.handleErrors(invController.deleteInventory),
);

// Comparison routes
router.get("/compare", 
  utilities.handleErrors(invController.buildComparison)
);

router.get("/add-compare/:inv_id", 
  utilities.handleErrors(invController.addToCompare)
);

module.exports = router;
