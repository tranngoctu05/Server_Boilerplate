const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const { createUserValidator, updateBioValidator } = require('../../validations/auth');
module.exports = (userService) => {
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { error } = createUserValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }
      const { username, email, password, bio } = req.body;
      const user = await userService.createUser({ username, email, password, bio });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const users = await userService.getListUser();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await userService.getCurrentUser(userId);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userService.findUserById(userId);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ error: err.message }); 
    }
  });
  router.patch('/user/:id', authenticateToken, async (req, res) => {
    try {
      const { error } = updateBioValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }
      const userId = req.params.id;
      const { bio } = req.body;
      const user = await userService.updateUserBio(userId, bio);
      res.status(200).json({ message: 'Bio updated successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.delete('/user/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      await userService.deleteUserById(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(404).json({ error: err.message }); // Trả về 404 nếu không tìm thấy
    }
  });
  router.post('/user/me/changepassword/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Old password and new password are required' });
      }

      const result = await userService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};