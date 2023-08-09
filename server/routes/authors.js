const express = require('express')
const router = express.Router()
const { authorEditDataValidate, authorPostDataValidate } = require('../validations/authors')

const AuthorsController = require('../app/controllers/authorsController')

router.get('/authors', AuthorsController.getAllAuthors)
router.get('/authors/posts', AuthorsController.getAllAuthorsAndPosts)
router.get('/authors/:id', AuthorsController.getAuthorById)
router.get('/authors/:id/posts', AuthorsController.getAuthorAndPostsById)
router.post('/authors', authorPostDataValidate, AuthorsController.createAuthor)
router.put('/authors/:id', authorEditDataValidate, AuthorsController.editAuthor)
router.delete('/authors/:id', AuthorsController.deleteAuthor)

module.exports = router