const { body, oneOf } = require('express-validator')

const postPostDataValidate = [
    body('title')
        .exists({ checkFalsy: true })
        .withMessage("Post title is required")
        .isString()
        .withMessage("Post title should be a string"),
    body('body')
        .exists({ checkFalsy: true })
        .withMessage("Post should have a body")
        .isString()
        .withMessage("Post should be a string"),
    body('author_id')
        .exists({ checkFalsy: true })
        .withMessage("Post should have an author")
        .isNumeric()
        .withMessage("Post author id should be an integer")
]

const postEditDataValidate = oneOf([
    body('title')
        .exists({ checkFalsy: true })
        .withMessage("Post title is required")
        .isString()
        .withMessage("Post title should be a string"),
    body('body')
        .exists({ checkFalsy: true })
        .withMessage("Post should have a body")
        .isString()
        .withMessage("Post should be a string"),
])

module.exports = { postPostDataValidate, postEditDataValidate }