const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.get('/', requireAuth, userController.getUers);
router.post('/', requireAuth, requireRole('admin'), userController.createUser);
router.put('/:id', requireAuth, requireRole('admin'), userController.updateUser);
router.delete('/:id', requireAuth, requireRole('admin'), userController.deleteUser)

module.exports = router;