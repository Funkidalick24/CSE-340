const pool = require("../database/")

const accountModel = {}

/* *****************************
*   Register new account
* *************************** */
accountModel.registerAccount = async function(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result
  } catch (error) {
    console.error("Error in registerAccount:", error)
    throw error
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const sql = 'SELECT * FROM account WHERE account_email = $1'
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error: " + error)
    return null
  }
}

module.exports = accountModel