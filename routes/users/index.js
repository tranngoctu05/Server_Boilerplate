const express = require('express');
const router = express.Router();

module.exports = (userService) => {
  // Route để thêm người dùng mới
  router.post('/create', async (req, res) => {
    console.error('POST request to /users with data:', req.body);
    try {
      const userData = req.body;
      const user = await userService.insertUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  // Route để lấy tất cả người dùng
  router.get('/find', async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  // Route để xóa người dùng theo ID
  router.delete('/delete/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await userService.deleteUser(userId);
      if (result) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  });

  // Route để cập nhật thông tin người dùng
  router.put('/update/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const updatedRows = await userService.updateUser(userId, updateData);
      if (updatedRows) {
        res.status(200).json({ message: 'User updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  });

  return router;
};
