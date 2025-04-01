// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Add new route for vehicle detail view
router.get("/detail/:invId", invController.buildByInventoryId);
// Add new route for inventory management view
router.get("/", invController.buildManagement)
// Add new route for adding classification
router.get("/add-classification", invController.buildAddClassification)
router.post("/add-classification", invController.addClassification)
// Add new route for adding inventory
router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", invController.addInventory)

module.exports = router;