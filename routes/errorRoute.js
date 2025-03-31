const express = require('express')
const router = express.Router()
const errorMiddleware = require("../middleware/error-middleware")

// Route to trigger 500 error
router.get("/trigger-500", errorMiddleware.trigger500Error)

// Route to trigger 404 error
router.get("/trigger-404", (req, res, next) => {
  next({status: 404, message: 'Intentional 404 error'})
})

module.exports = router