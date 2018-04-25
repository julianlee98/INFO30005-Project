const express = require('express');
const router = express.Router();
const controller = require("../controllers/testDb Controller");

router.get('/', controller.loginPage);
router.get('/login', controller.loginPage);
router.get('/home', controller.homePage);
router.get('/settings', controller.settingsPage);
router.get('/profile', controller.profilePage);
router.get('/workout_builder', controller.workoutBuilder);
router.get('/workout_search', controller.workoutSearch);


router.get('/comingSoon', controller.comingSoon);

router.get('/api', controller.findAllUsers);
router.post('/api', controller.createUserFunc);

router.get('/api/:uemail', controller.findUser)



module.exports = router;