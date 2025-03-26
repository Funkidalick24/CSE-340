const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return result
  } catch (error) {
    console.error("getClassifications error " + error)
    throw error
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    throw error // Add error throw
  }
}

/* ***************************
 *  Get vehicle detail by inventory id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error " + error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById // Add to exports
}