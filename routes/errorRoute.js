const express = require('express')
const router = express.Router()
const errorMiddleware = require("../middleware/error-middleware")

// Route to trigger 500 error
router.get("/trigger", errorMiddleware.trigger500Error)

module.exports = router