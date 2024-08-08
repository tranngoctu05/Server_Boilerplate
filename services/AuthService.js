const Models = require('../models/sequelize/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redisClient');
const _CONF = require('../config/token')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
class AuthService {
    constructor(sequelize) {
        Models(sequelize);
        this.client = sequelize;
        this.models = sequelize.models;
    }
    async register(userData) {
        try {
            const { email, password } = userData;
            const existingUser = await this.models.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const user = await this.models.User.create({ email, password });
            return user;
        } catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    }
    async login(email, password, response) {
        try {
            const user = await this.models.User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ id: user.id }, _CONF.SECRET, { expiresIn: _CONF.tokenLife });
            const refreshToken = jwt.sign({ id: user.id }, _CONF.SECRET_REFRESH, { expiresIn: _CONF.refreshTokenLife });
            await redisClient.set(`refreshToken:${user.id}`, refreshToken, 'EX', 60 * 60 * 24 * 7); // 7 ngày
            response.json({ message: 'Logged in successfully', token, refreshToken });
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    async refreshToken(oldRefreshToken) {
        try {
            const decoded = jwt.verify(oldRefreshToken, _CONF.SECRET_REFRESH);
            const userId = decoded.id;
            const storedToken = await redisClient.get(`refreshToken:${userId}`);
            if (storedToken !== oldRefreshToken) {
                throw new Error('Invalid refresh token');
            }
            const newToken = jwt.sign({ id: userId }, _CONF.SECRET, { expiresIn: _CONF.tokenLife });
            const newRefreshToken = jwt.sign({ id: userId }, _CONF.SECRET_REFRESH, { expiresIn: _CONF.refreshTokenLife }); // refresh
            await redisClient.set(`refreshToken:${userId}`, newRefreshToken, 'EX', 60 * 60 * 24 * 7); // 7 ngày
            return { newToken, newRefreshToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async forgotPassword(email) {
        try {
            const user = await this.models.User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            await redisClient.set(`resetToken:${resetToken}`, user.id, 'EX', 60 * 60 * 1); // 1 giờ

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

            await transporter.sendMail({
                to: email,
                subject: 'Password Reset',
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
            });

            return { message: 'Password reset link sent to your email' };
        } catch (error) {
            console.error('Error during forgot password:', error);
            throw error;
        }
    }
    async verifyForgotPassword(token) {
        try {
            const userId = await redisClient.get(`resetToken:${token}`);
            if (!userId) {
                throw new Error('Invalid or expired reset token');
            }
            return { message: 'Token is valid', userId };
        } catch (error) {
            console.error('Error during verify forgot password:', error);
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const userId = await redisClient.get(`resetToken:${token}`);
            if (!userId) {
                throw new Error('Invalid or expired reset token');
            }

            const user = await this.models.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await user.update({ password: hashedPassword });

            await redisClient.del(`resetToken:${token}`);

            return { message: 'Password reset successfully' };
        } catch (error) {
            console.error('Error during reset password:', error);
            throw error;
        }
    }
}

module.exports = AuthService;