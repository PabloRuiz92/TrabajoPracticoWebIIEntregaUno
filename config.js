/*
const { config } = require("dotenv");
config();

const SQLITE_USR = process.env.SQLITE_USR;
const SQLITE_PWD = process.env.SQLITE_PWD;

module.exports = { SQLITE_USR, SQLITE_PWD };
*/

require("dotenv").config();

const { SQLITE_URL } = process.env;

module.exports = { SQLITE_URL };