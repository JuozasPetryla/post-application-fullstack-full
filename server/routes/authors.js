const express = require('express')
const router = express.Router()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/express.db')
const socketIo = require('../socket')
const { validationResult } = require('express-validator')
const { authorEditDataValidate, authorPostDataValidate } = require('../validations/author')
const query = "SELECT * FROM Authors"


// Get all authors

router.get('/authors', (req, res) => {
    let totalPages
    const page = +req.query.page || 1
    const per_page = +req.query.per_page || 10
    const paginationQuery = `LIMIT ${per_page} OFFSET ${(page - 1) * per_page}`

    db.all(query, (err, authors) => {
        if (authors.length === 0) {
            return res.status(404).json({ error: 'Authors not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting authors.' });
        }

        totalPages = Math.ceil(authors.length / per_page)

        db.all(`${query} ${paginationQuery}`, (err, authorsPaged) => {
            if (authorsPaged.length === 0) {
                return res.status(404).json({ error: 'Authors not found.', totalAuthors: authors.length, currentPage: page, totalPages });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting authors.' });
            }
            res.send({ authors: authorsPaged, totalAuthors: authors.length, currentPage: page, totalPages })
        })
    })
})

// Get authors and their posts

router.get('/authors/posts', (req, res) => {
    const queryAuthorPosts = `SELECT *, (SELECT json_group_array(
        json_object(
            'id', id,
            'title', title,
            'body', body, 
            'author_id', author_id, 
            'created_at', created_at, 
            'updated_at', updated_at)) AS posts
        FROM Posts
        WHERE author_id = Authors.id) AS posts
        FROM Authors`
    const page = +req.query.page || 1
    const per_page = +req.query.per_page || 10
    const paginationQuery = `LIMIT ${per_page} OFFSET ${(page - 1) * per_page}`
    let totalPages

    db.all(queryAuthorPosts, (err, authorsWithPosts) => {

        if (authorsWithPosts.length === 0) {
            return res.status(404).json({ error: 'Authors not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting authors.' });
        }

        totalPages = Math.ceil(authorsWithPosts.length / per_page)

        db.all(`${queryAuthorPosts} ${paginationQuery}`, (err, authorsPaged) => {
            if (authorsPaged.length === 0) {
                return res.status(404).json({ error: 'Authors not found.', totalAuthors: authorsWithPosts.length, currentPage: page, totalPages });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting authors.' });
            }

            const formattedAuthorsWithPosts = authorsPaged.map(author => ({
                ...author,
                posts: JSON.parse(author.posts)
            }));

            res.send({ authors: formattedAuthorsWithPosts, totalAuthors: authorsWithPosts.length, currentPage: page, totalPages })
        })

    })
})


// Get single author

router.get('/authors/:id', (req, res) => {
    db.get(`${query} WHERE id = ${req.params.id}`, (err, author) => {
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting author.' });
        }
        res.send(author)
    })
})

// Get single author and his posts

router.get('/authors/:id/posts', (req, res) => {
    db.get(`${query} WHERE id = ${req.params.id}`, (err, author) => {
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }
        if (err) {
            return res.status(500).json({ error: 'Error getting author.' });
        }
        db.all(`SELECT * FROM Posts WHERE author_id = ${author.id}`, (err, posts) => {
            if (!posts) {
                return res.status(404).json({ error: 'Posts not found.' });
            }
            if (err) {
                return res.status(500).json({ error: 'Error getting posts.' });
            }
            res.send({ ...author, posts })
        })
    })
})


// Create new author

router.post('/authors', authorPostDataValidate, (req, res) => {
    const db = new sqlite3.Database('./db/express.db')
    const date = new Date().toLocaleString()

    const { name, surname } = req.body;

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        })
    }

    const query = `INSERT INTO authors (name, surname, created_at, updated_at) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, surname, date, date], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating author.' });
        } socketIo.emit('newAuthor', {
            id: this.lastID,
        })
        res.status(200).json({ msg: 'Author created succesfully', id: this.lastID });
    });

    db.close()
})

// Update author

router.put('/authors/:id', authorEditDataValidate, (req, res) => {
    const db = new sqlite3.Database('./db/express.db')
    const date = new Date().toLocaleString()


    const name = `${req.body.name ? `name = "${req.body.name}",` : ''}`
    const surname = `${req.body.surname ? `surname = "${req.body.surname}",` : ''}`

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.errors[0].nestedErrors.flatMap(error => error)
        })
    }

    db.get(`${query} WHERE id = ${req.params.id}`, (err, author) => {
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }

        const query = `UPDATE Authors SET ${name} ${surname} updated_at = "${date}" WHERE id = ${author.id}`;
        db.run(query, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error editing author.' });
            } socketIo.emit('updatedAuthor', {
                id: author.id,
            })
            res.status(200).json({ msg: 'Author edited succesfully', id: author.id });
        });

        db.close()
    })

})

// Delete author

router.delete('/authors/:id', (req, res) => {
    const db = new sqlite3.Database('./db/express.db')

    db.get(`${query} WHERE id = ${req.params.id}`, (err, author) => {
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }

        const queryAuthor = `DELETE FROM Authors WHERE id = ${author.id}`;
        const queryAuthorsPosts = `DELETE FROM Posts WHERE author_id = ${author.id}`;

        db.run(queryAuthor, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error deleting author.' });
            }
            db.run(queryAuthorsPosts, function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error deleting author.' });
                }
                socketIo.emit('deleteAuthor', {
                    id: author.id,
                })
                res.status(200).json({ msg: 'Author deleted succesfully', id: author.id });
            });
        });

        db.close()
    })
})




module.exports = router