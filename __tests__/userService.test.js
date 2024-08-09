const request = require('supertest');
const app = require('../app'); // Đường dẫn đến tệp app của bạn
const { User } = require('../models/sequelize/index');
const sequelize = require('../bin/run'); // Đảm bảo bạn đã khởi tạo sequelize

describe('User Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  test('POST /users should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      })
      .expect(201);

    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });

  test('POST /users should return error for duplicate email', async () => {
    await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'password456',
        bio: 'This is another bio'
      })
      .expect(422);

    expect(response.body.errors).toContain('Email already exists');
  });

  test('GET /users should retrieve a list of users', async () => {
    await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('username', 'testuser1');
  });

  test('GET /users/me should retrieve the current user', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const token = userResponse.headers['authorization'].split(' ')[1];

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('username', 'testuser');
  });

  test('GET /users/:id should retrieve a user by ID', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const userId = userResponse.body.user.id;

    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .expect(200);

    expect(response.body).toHaveProperty('username', 'testuser');
  });

  test('PATCH /users/user/:id should update user bio', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const userId = userResponse.body.user.id;

    const response = await request(app)
      .patch(`/users/user/${userId}`)
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({ bio: 'Updated bio' })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Bio updated successfully');
    expect(response.body.user).toHaveProperty('bio', 'Updated bio');
  });

  test('DELETE /users/user/:id should delete a user', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const userId = userResponse.body.user.id;

    await request(app)
      .delete(`/users/user/${userId}`)
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .expect(200);

    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .expect(404);

    expect(response.body.error).toBe('User not found');
  });

  test('POST /users/me/changepassword/:id should change user password', async () => {
    const userResponse = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a bio'
      });

    const userId = userResponse.body.user.id;

    const response = await request(app)
      .post(`/users/me/changepassword/${userId}`)
      .set('Authorization', 'Bearer YOUR_VALID_TOKEN') // Thay thế bằng token hợp lệ
      .send({
        oldPassword: 'password123',
        newPassword: 'newpassword456'
      })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Password changed successfully');
  });
});
