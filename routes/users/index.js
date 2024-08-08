const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const { registerValidator } = require('../../validations/auth');
module.exports = (userService) => {
  router.post('/createuser', authenticateToken, async (req, res) => {
    try {
      const { error } = registerValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }
        const { username, email, password, bio } = req.body;
        const userId = req.user.id;
        const user = await userService.createUser({ username, email, password, bio });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

  return router;
};