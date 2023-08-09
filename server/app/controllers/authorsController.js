const { validationResult } = require('express-validator')
const { PostsModel, AuthorsModel } = require('../models/models')
const socketIo = require('../../socket');

const getAllAuthors = async (req, res) => {
    try {
        let totalPages
        const page = +req.query.page || 1
        const per_page = +req.query.per_page || 10
        const offset = (page - 1) * per_page


        const authors = await AuthorsModel.findAll();
        if (authors.length === 0) {
            return res.status(404).json({ message: 'No authors found.' });
        }

        totalPages = Math.ceil(authors.length / per_page)

        const authorsPaged = await AuthorsModel.findAll({
            offset, limit: per_page,
        });

        if (authorsPaged.length === 0) {
            return res.status(404).json({ message: 'No authors found on this page.' });
        }
        res.status(200).json({ authors: authorsPaged, totalAuthors: authors.length, totalPages, currentPage: page })
    } catch (error) {
        res.json({ error: "Error fetching authors" })
    }
}

const getAllAuthorsAndPosts = async (req, res) => {
    try {
        let totalPages
        const page = +req.query.page || 1
        const per_page = +req.query.per_page || 10
        const offset = (page - 1) * per_page


        const authors = await AuthorsModel.findAll();
        if (authors.length === 0) {
            return res.status(404).json({ message: 'No authors found.' });
        }

        totalPages = Math.ceil(authors.length / per_page)

        const authorsPaged = await AuthorsModel.findAll({
            offset, limit: per_page,
            include: [
                { model: PostsModel }
            ]
        });

        if (authorsPaged.length === 0) {
            return res.status(404).json({ message: 'No authors found on this page.' });
        }

        res.status(200).json({ authors: authorsPaged, totalAuthors: authors.length, totalPages, currentPage: page })
    } catch (error) {
        res.json({ error: "Error fetching authors" })
    }
}

const getAuthorById = async (req, res) => {
    try {
        const author = await AuthorsModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!author) {
            return res.status(404).json({ message: 'No author found by this id.' });
        }
        res.json(author)
    } catch (error) {
        res.json({ error: "Error fetching author" })
    }
}
const getAuthorAndPostsById = async (req, res) => {
    try {
        const author = await AuthorsModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                { model: PostsModel }
            ]
        });
        if (!author) {
            return res.status(404).json({ message: 'No author found by this id.' });
        }
        res.json(author)
    } catch (error) {
        res.json({ error: "Error fetching author" })
    }
}

const createAuthor = async (req, res) => {
    try {
        const date = new Date().toLocaleString()
        const { name, surname } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        const author = await AuthorsModel.create(
            {
                name,
                surname,
                created_at: date,
                updated_at: date,
            },
        )

        socketIo.emit('newAuthor', author.id)

        res.status(200).json({ msg: 'Author created succesfully', id: author.id });
    } catch (error) {
        res.json({ error: "Error creating author" })
    }
}

const editAuthor = async (req, res) => {
    try {
        const date = new Date().toLocaleString()
        const { name, surname } = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.errors[0].nestedErrors.flatMap(error => error)
            })
        }
        const authorToEdit = await AuthorsModel.findOne(
            {
                where: {
                    id: req.params.id
                }
            }
        )

        if (!authorToEdit) {
            return res.status(404).json({ message: 'No author found by this id.' });
        }

        const author = await AuthorsModel.update(
            {
                name,
                surname,
                updated_at: date,
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        socketIo.emit('updatedAuthor', authorToEdit.id)


        res.status(200).json({ msg: 'Author edited succesfully', id: authorToEdit.id });
    } catch (error) {
        res.json({ error: "Error updating author" })
    }
}

const deleteAuthor = async (req, res) => {
    try {
        const authorToDelete = await AuthorsModel.findOne(
            {
                where: {
                    id: req.params.id
                }
            }
        )

        if (!authorToDelete) {
            return res.status(404).json({ message: 'No author found by this id.' });
        }

        const post = await PostsModel.destroy(
            {
                where: {
                    author_id: req.params.id
                },
            }
        )

        const author = await AuthorsModel.destroy(
            {
                where: {
                    id: req.params.id
                },
            }
        )
        socketIo.emit('deleteAuthor', authorToDelete.id)

        res.status(200).json({ msg: 'Author deleted succesfully', id: authorToDelete.id });
    } catch (error) {
        res.json({ error: "Error deleting author" })
    }
}


module.exports = {
    getAllAuthors,
    getAllAuthorsAndPosts,
    createAuthor,
    getAuthorById,
    getAuthorAndPostsById,
    editAuthor,
    deleteAuthor
}