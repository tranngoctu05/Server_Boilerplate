const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const { createPostValidator, updatePostValidator } = require('../../validations/post');

module.exports = (postService) => {
    // Tạo bài viết mới
    router.post('/', authenticateToken, async (req, res) => {
        try {
            const { error } = createPostValidator(req.body);
            if (error) {
                return res.status(422).json({ errors: error.details.map(err => err.message) });
            }
            const { title, content, userId } = req.body;
            const post = await postService.createPost({ title, content, userId });
            res.status(201).json({ message: 'Post created successfully', post });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    // Lấy danh sách tất cả bài viết
    router.get('/', authenticateToken, async (req, res) => {
        try {
            const posts = await postService.getPosts();
            res.status(200).json(posts);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    // Lấy thông tin một bài viết theo ID
    router.get('/:id', authenticateToken, async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await postService.getPostById(postId);
            res.status(200).json(post);
        } catch (err) {
            res.status(404).json({ error: err.message }); // Trả về 404 nếu không tìm thấy bài viết
        }
    });

    // Cập nhật một bài viết theo ID
    router.patch('/:id', authenticateToken, async (req, res) => {
        try {
            const { error } = updatePostValidator(req.body);
            if (error) {
                return res.status(422).json({ errors: error.details.map(err => err.message) });
            }
            const postId = req.params.id;
            const { title, content } = req.body;
            const post = await postService.updatePost(postId, { title, content });
            res.status(200).json({ message: 'Post updated successfully', post });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    // Xóa một bài viết theo ID
    router.delete('/:id', authenticateToken, async (req, res) => {
        try {
            const postId = req.params.id;
            await postService.deletePost(postId);
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (err) {
            res.status(404).json({ error: err.message }); // Trả về 404 nếu không tìm thấy bài viết
        }
    });

    return router;
};
