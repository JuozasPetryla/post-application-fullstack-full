const { validationResult } = require('express-validator')
const { Op } = require('sequelize');
const { PostsModel, AuthorsModel } = require('../models/models');
const socketIo = require('../../socket');

const getAllPosts = async (req, res) => {
    try {
        let totalPages
        const page = +req.query.page || 1
        const per_page = +req.query.per_page || 10
        const offset = (page - 1) * per_page
        const { search } = req.query
        const searchQuery = {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ]
        }


        const posts = await PostsModel.findAll({
            where: searchQuery
        });
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found.' });
        }

        totalPages = Math.ceil(posts.length / per_page)

        const postsPaged = await PostsModel.findAll({
            offset, limit: per_page, where: searchQuery
        }

        );
        if (postsPaged.length === 0) {
            return res.status(404).json({ message: 'No posts found on this page.' });
        }

        res.status(200).json({ posts: postsPaged, totalPosts: posts.length, totalPages, currentPage: page })
    } catch (error) {
        res.json({ error: "Error fetching posts" })
    }
}

const getAllPostsWithAuthors = async (req, res) => {
    try {
        let totalPages
        const page = +req.query.page || 1
        const per_page = +req.query.per_page || 10
        const offset = (page - 1) * per_page
        const { search } = req.query
        const searchQuery = search ? {
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ]
        } : ''

        const posts = await PostsModel.findAll({ where: searchQuery });
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found.' });
        }

        totalPages = Math.ceil(posts.length / per_page)

        const postsPaged = await PostsModel.findAll({
            offset, limit: per_page, where: searchQuery,
            include: [
                { model: AuthorsModel }
            ]
        }
        );

        if (postsPaged.length === 0) {
            return res.status(404).json({ message: 'No posts found on this page.' });
        }
        res.status(200).json({ posts: postsPaged, totalPosts: posts.length, totalPages, currentPage: page })
    } catch (error) {
        res.json({ error: "Error fetching posts" })
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await PostsModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!post) {
            return res.status(404).json({ message: 'No post found by this id.' });
        }
        res.json(post)
    } catch (error) {
        res.json({ error: "Error fetching post" })
    }
}

const getPostAndAuthorById = async (req, res) => {
    try {
        const post = await PostsModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                { model: AuthorsModel }
            ]
        });
        if (!post) {
            return res.status(404).json({ message: 'No post found by this id.' });
        }
        res.json(post)
    } catch (error) {
        res.json({ error: "Error fetching post" })
    }
}

const createPost = async (req, res) => {
    try {
        const date = new Date().toLocaleString()
        const { title, body, author_id } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        const post = await PostsModel.create(
            {
                title,
                author_id,
                content: body,
                created_at: date,
                updated_at: date,
            },
        );

        socketIo.emit('newPost', post.id)

        res.status(200).json({ msg: 'Post created succesfully', id: post.id });
    } catch (error) {
        res.json({ error: "Error creating post" })
    }
}

const editPost = async (req, res) => {
    try {
        const date = new Date().toLocaleString()
        const { title, body } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.errors[0].nestedErrors.flatMap(error => error)
            })
        }
        const postToEdit = await PostsModel.findOne(
            {
                where: {
                    id: req.params.id
                }
            }
        )



        if (!postToEdit) {
            return res.status(404).json({ message: 'No post found by this id.' });
        }

        const post = await PostsModel.update(
            {
                title: title,
                content: body,
                updated_at: date,
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
        socketIo.emit('updatedPost', postToEdit.id)

        res.status(200).json({ msg: 'Post edited succesfully', id: postToEdit.id });
    } catch (error) {
        res.json({ error: "Error updating post" })
    }
}

const deletePost = async (req, res) => {
    try {
        const postToDelete = await PostsModel.findOne(
            {
                where: {
                    id: req.params.id
                }
            }
        )

        if (!postToDelete) {
            return res.status(404).json({ message: 'No post found by this id.' });
        }

        const post = await PostsModel.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        )

        socketIo.emit('deletePost', postToDelete.id)


        res.status(200).json({ msg: 'Post deleted succesfully', id: postToDelete.id });
    } catch (error) {
        res.json({ error: "Error deleting post" })
    }
}

module.exports = {
    getAllPosts,
    getAllPostsWithAuthors,
    createPost,
    getPostById,
    getPostAndAuthorById,
    editPost,
    deletePost
}