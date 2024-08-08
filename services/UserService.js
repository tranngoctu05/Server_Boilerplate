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
}

module.exports = UserService;