const Models = require('../models/sequelize/index');

class UserService {
  constructor(sequelize) {
    Models(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  // Hàm thêm người dùng mới
  async insertUser(userData) {
    try {
      const user = await this.models.User.create(userData);
      return user;
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }

  // Hàm lấy tất cả người dùng
  async getAllUsers() {
    try {
      const users = await this.models.User.findAll();
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Hàm xóa người dùng theo ID
  async deleteUser(userId) {
    try {
      const result = await this.models.User.destroy({
        where: { id: userId },
      });
      return result; // Trả về số lượng bản ghi đã bị xóa
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Hàm cập nhật thông tin người dùng
  async updateUser(userId, updateData) {
    try {
      const [updatedRows] = await this.models.User.update(updateData, {
        where: { id: userId },
      });
      return updatedRows; // Trả về số lượng bản ghi đã được cập nhật
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

module.exports = UserService;
