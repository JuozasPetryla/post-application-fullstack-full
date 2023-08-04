const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/express.db')
const socketIo = require('../socket')
const { postEditDataValidate, postPostDataValidate } = require('../validations/posts')
const { validationResult } = require('express-validator')

const query = "SELECT * FROM Posts"

// Get all posts

router.get('/posts', (req, res) => {
    const page = +req.query.page || 1
    const per_page = +req.query.per_page || 10
    const paginationQuery = `LIMIT ${per_page} OFFSET ${(page - 1) * per_page}`
    const queryGetAll = !req.query.search ? query : `${query} WHERE title LIKE '%${req.query.search}%' OR body LIKE '%${req.query.search}%'`

    db.all(queryGetAll, (err, posts) => {
        let totalPages
        totalPages = Math.ceil(posts.length / per_page)
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found by this query.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting posts.' });
        }
        db.all(`${queryGetAll} ${paginationQuery}`, (err, postsPaginated) => {
            if (postsPaginated.length === 0) {
                return res.status(404).json({ error: 'No posts found by this query.', totalPost: posts.length, currentPage: page, totalPages });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting posts.' });
            }
            res.send({ posts: postsPaginated, totalPost: posts.length, currentPage: page, totalPages })
        })
    })
})

// Get posts with authors

router.get('/posts/authors', (req, res) => {
    const queryPostAuthors = `SELECT *, (SELECT json_object(
        'id', id,
        'name', name,
        'surname', surname,
        'created_at', created_at,
        'updated_at', updated_at
    ) FROM Authors
    WHERE id = Posts.author_id) AS author
    FROM Posts`
    const page = +req.query.page || 1
    const per_page = +req.query.per_page || 10
    const paginationQuery = `LIMIT ${per_page} OFFSET ${(page - 1) * per_page}`
    const queryGetAll = !req.query.search ? queryPostAuthors : `${queryPostAuthors} WHERE title LIKE '%${req.query.search}%' OR body LIKE '%${req.query.search}%'`
    let totalPages

    db.all(queryGetAll, (err, postsWithAuthor) => {
        totalPages = Math.ceil(postsWithAuthor.length / per_page)
        if (postsWithAuthor.length === 0) {
            return res.status(404).json({ error: 'Posts not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting authors.' });
        }
        db.all(`${queryGetAll} ${paginationQuery}`, (err, postsPaginated) => {
            if (postsPaginated.length === 0) {
                return res.status(404).json({ error: 'No posts found by this query.', totalPost: postsWithAuthor.length, currentPage: page, totalPages });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting posts.' });
            }

            const formattedPostsWithAuthor = postsPaginated.map(posts => ({
                ...posts,
                author: JSON.parse(posts.author)
            }));


            res.send({ posts: formattedPostsWithAuthor, totalPost: postsWithAuthor.length, currentPage: page, totalPages })
        })
    })
})

// Get single post with author

router.get('/posts/:id/authors', (req, res) => {
    db.get(`${query} WHERE id = ${req.params.id}`, (err, post) => {
        if (!post) {
            return res.status(404).json({ error: 'Posts not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting post.' });
        }
        db.get(`SELECT * FROM Authors WHERE id = ${post.author_id}`, (err, author) => {
            if (!author) {
                return res.status(404).json({ error: 'Author not found.' });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting author.' });
            }
            res.send({ ...post, author })
        })
    })
})

// Get single post

router.get('/posts/:id', (req, res) => {
    db.get(`${query} WHERE id = ${req.params.id}`, (err, post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting post.' });
        }
        res.send(post)
    })
})

// Create new post

router.post('/posts', postPostDataValidate, (req, res) => {
    const date = new Date().toLocaleString()
    const db = new sqlite3.Database('./db/express.db')

    const { title, body, author_id } = req.body;

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }
    db.get(`SELECT * FROM Authors WHERE id = ${author_id}`, (err, author) => {
        if (!author) {
            return res.status(404).json({ error: 'Not a valid author.' });
        }

        const query = `INSERT INTO Posts (title, body, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [title, body, author_id, date, date], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating post.' });
            }
            socketIo.emit('newPost', {
                id: this.lastID
            })
            res.status(200).json({ msg: 'Post created succesfully', id: this.lastID });
        });
        db.close()
    })

})

// Update post

router.put('/posts/:id', postEditDataValidate, (req, res) => {
    const date = new Date().toLocaleString()
    const db = new sqlite3.Database('./db/express.db')

    const title = `${req.body.title ? `title = "${req.body.title}",` : ''}`
    const body = `${req.body.body ? `body = "${req.body.body}",` : ''}`

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.errors[0].nestedErrors.flatMap(error => error)
        })
    }

    db.get(`${query} WHERE id = ${req.params.id}`, (err, post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        const query = `UPDATE Posts SET ${title} ${body} updated_at = "${date}" WHERE id = ${post.id}`;
        db.run(query, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error editing post.' });
            }
            socketIo.emit('updatedPost', {
                id: post.id,
            })
            res.status(200).json({ msg: 'Post edited succesfully', id: post.id });
        });
        db.close()
    })
})

// Delete post

router.delete('/posts/:id', (req, res) => {
    const db = new sqlite3.Database('./db/express.db')

    db.get(`${query} WHERE id = ${req.params.id}`, (err, post) => {
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        const query = `DELETE FROM Posts WHERE id = ${post.id}`;
        db.run(query, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error deleting post.' });
            }
            socketIo.emit('deletePost', {
                id: post.id,
            })
            res.status(200).json({ msg: 'Post deleted succesfully', id: post.id });
        });
        db.close()
    })
})


module.exports = router