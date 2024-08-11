const Models = require('../models/sequelize/index');

class PostService {
    constructor(sequelize) {
        Models(sequelize);
        this.client = sequelize;
        this.models = sequelize.models;
    }

    // Tạo bài viết mới
    async createPost(postData) {
        try {
            const { title, content, userId } = postData;
            const post = await this.models.Post.create({ title, content, userId });
            return post;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    // Lấy danh sách tất cả các bài viết
    async getPosts() {
        try {
            const posts = await this.models.Post.findAll({
                attributes: ['id', 'title', 'content', 'userId', 'createdAt', 'updatedAt'],
                include: [{
                    model: this.models.User,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }]
            });
            return posts;
        } catch (error) {
            console.error('Error retrieving posts:', error);
            throw error;
        }
    }

    // Lấy một bài viết theo ID
    async getPostById(postId) {
        try {
            const post = await this.models.Post.findByPk(postId, {
                attributes: ['id', 'title', 'content', 'userId', 'createdAt', 'updatedAt'],
                include: [{
                    model: this.models.User,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }]
            });
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        } catch (error) {
            console.error('Error retrieving post by ID:', error);
            throw error;
        }
    }

    // Cập nhật một bài viết theo ID
    async updatePost(postId, updateData) {
        try {
            const post = await this.models.Post.findByPk(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            const { title, content } = updateData;
            if (title) post.title = title;
            if (content) post.content = content;

            await post.save();
            return post;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    // Xóa bài viết theo ID
    async deletePost(postId) {
        try {
            const post = await this.models.Post.findByPk(postId);
            if (!post) {
                throw new Error('Post not found');
            }
            await post.destroy();
            return { message: 'Post deleted successfully' };
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
}

module.exports = PostService;
