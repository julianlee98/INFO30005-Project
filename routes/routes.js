const express = require('express');
const router = express.Router();
const controller = require("../controllers/testDb Controller");

router.get('/', controller.formatedContent);
router.get('/comingSoon', controller.comingSoon);

module.exports = router;