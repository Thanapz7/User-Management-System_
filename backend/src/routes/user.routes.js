const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/users', requireAuth, userController.getAllUsers);
router.post('/users', requireAuth, requireAdmin, userController.createUser);
router.put('/users/:id', requireAuth, requireAdmin, userController.updateUser);
router.delete('/users/:id', requireAuth, requireAdmin, userController.deleteUser);

module.exports = router;
