const Models = require('../models/sequelize/index');
class UserService {
  constructor(sequelize) {
    Models(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  async createUser(userData) {
    try {
      const { username, email, password, bio } = userData;
      const existingUser = await this.models.User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }
      const user = await this.models.User.create({ username, email, password, bio });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async getListUser() {
    try {
      const users = await this.models.User.findAll({
        attributes: ['id', 'username', 'email', 'bio', 'createdAt', 'updatedAt']
      });
      return users;
    } catch (error) {
      console.error('Error retrieving user list:', error);
      throw error;
    }
  }
  async getCurrentUser(userId) {
    try {
      const user = await this.models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'bio', 'createdAt', 'updatedAt']
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error retrieving current user:', error);
      throw error;
    }
  }
  async findUserById(userId) {
    try {
      const user = await this.models.User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'bio', 'createdAt', 'updatedAt']
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
  async updateUserBio(userId, newBio) {
    try {
      const user = await this.models.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.bio = newBio;
      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating user bio:', error);
      throw error;
    }
  }
  async deleteUserById(userId) {
    try {
      const user = await this.models.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      await user.destroy();
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await this.models.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Incorrect old password');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

module.exports = UserService;