const express = require('express')
const router = express.Router()
const socketIo = require('../socket')
const { postEditDataValidate, postPostDataValidate } = require('../validations/posts')

const PostsController = require('../app/controllers/postsController')

router.get('/posts', PostsController.getAllPosts)
router.get('/posts/authors', PostsController.getAllPostsWithAuthors)
router.get('/posts/:id', PostsController.getPostById)
router.get('/posts/:id/authors', PostsController.getPostAndAuthorById)
router.post('/posts', postPostDataValidate, PostsController.createPost)
router.put('/posts/:id', postEditDataValidate, PostsController.editPost)
router.delete('/posts/:id', PostsController.deletePost)


module.exports = router