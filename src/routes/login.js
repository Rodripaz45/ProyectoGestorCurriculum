const express = require('express');
const LoginController = require('../controllers/LoginController');

const router = express.Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.auth);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.get('/logout', LoginController.logout);
router.get('/curriculum', LoginController.loadCurriculum);
router.post('/curriculum', LoginController.saveCurriculum);
router.get('/home', LoginController.home);


module.exports = router;

