const pool = require("../database/");
const bcryptjs = require("bcryptjs");

const accountModel = {};

/* *****************************
 *   Register new account
 * *************************** */
accountModel.registerAccount = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    // Hash the password before storing
    const hashedPassword = await bcryptjs.hash(account_password, 10);
    
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
    ]);
    return result;
  } catch (error) {
    console.error("registerAccount error:", error);
    throw error;
  }
};

/* *****************************
 * Return account data using email address
 * ***************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error: " + error);
    return null;
  }
};

/* *****************************
 * Get account by ID
 * ***************************** */
accountModel.getAccountById = async function (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return null;
  }
};

/* *****************************
 * Update account information
 * ***************************** */
accountModel.updateAccount = async function (account) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account.account_firstname,
      account.account_lastname,
      account.account_email,
      account.account_id
    ]);
    return data.rows[0];
  } catch (error) {
    return null;
  }
};

/* *****************************
 * Update password
 * ***************************** */
accountModel.updatePassword = async function (hashedPassword, account_id) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [hashedPassword, account_id]);
    return data.rows[0];
  } catch (error) {
    return null;
  }
};

module.exports = accountModel;
