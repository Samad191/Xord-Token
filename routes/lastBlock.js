const express = require("express");
const router = express.Router();
const email_controller = require('../controllers/email_controller.js')

const lastBlock_controller = require('../controllers/lastBlock.js')

router.get("/updateBlock", lastBlock_controller.test);

module.exports = {
  router,
};
