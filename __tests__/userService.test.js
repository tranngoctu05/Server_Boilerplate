const request = require('supertest');
const app = require('../app'); // Thay thế bằng đường dẫn tới tệp app của bạn
const { sequelize, User } = require('../models/sequelize'); // Thay thế nếu bạn cần import thêm mô hình

beforeAll(async () => {
    // Kết nối cơ sở dữ liệu trước khi chạy các test
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Đóng kết nối cơ sở dữ liệu sau khi chạy các test
    await sequelize.close();
});

describe('User API Tests', () => {
    let token; // Token cho việc test các API yêu cầu xác thực

    beforeAll(async () => {
        // Đăng ký và lấy token để test các API cần xác thực
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
                username: 'testuser',
                bio: 'Test bio'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        token = response.body.token;
    });

    test('Create user', async () => {
        const response = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'newuser@example.com',
                password: 'password123',
                username: 'newuser',
                bio: 'New user bio'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('user');
    });

    test('Get list of users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('Get current user', async () => {
        const user = await User.findOne({ where: { email: 'testuser@example.com' } });

        const response = await request(app)
            .get(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('Update user bio', async () => {
        const user = await User.findOne({ where: { email: 'testuser@example.com' } });

        const response = await request(app)
            .patch(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ bio: 'Updated bio' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.bio).toBe('Updated bio');
    });

    test('Delete user', async () => {
        const user = await User.findOne({ where: { email: 'testuser@example.com' } });

        const response = await request(app)
            .delete(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    test('Change password', async () => {
        const user = await User.findOne({ where: { email: 'testuser@example.com' } });

        const response = await request(app)
            .post(`/api/users/${user.id}/change-password`)
            .set('Authorization', `Bearer ${token}`)
            .send({ oldPassword: 'password123', newPassword: 'newpassword123' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Password changed successfully');
    });
});
