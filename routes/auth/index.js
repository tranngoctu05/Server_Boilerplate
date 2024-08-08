// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerValidator } = require('../../validations/auth');
const authenticateToken = require('../../middlewares/authMiddleware');
module.exports = (authService) => {
  router.post('/register', async (req, res, next) => {
    try {
      const { error } = registerValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const { error } = registerValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }

      const { email, password } = req.body;
      await authService.login(email, password, res);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.post('/logout', authenticateToken, (req, res) => {
    try {
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/refresh', async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
      const { newToken, newRefreshToken } = await authService.refreshToken(refreshToken);
      res.json({ newToken, newRefreshToken });
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  });
  router.post('/forgotpassword', async (req, res) => {
    try {
      const { error } = registerValidator(req.body);
      if (error) {
        return res.status(422).json({ errors: error.details.map(err => err.message) });
      }
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.post('/verifyforgotpassword', async (req, res) => {
    try {
      const { token } = req.body;
      const result = await authService.verifyForgotPassword(token);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.post('/resetpassword', async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  return router;
};
