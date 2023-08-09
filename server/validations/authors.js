const { body, oneOf } = require("express-validator")

const authorPostDataValidate = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage("Author name is required")
        .isString()
        .withMessage("Author name should be a string"),
    body("surname")
        .exists({ checkFalsy: true })
        .withMessage("Author surname is required")
        .isString()
        .withMessage("Author surname should be a string"),
]

const authorEditDataValidate = oneOf([
    body('name')
        .exists({ checkFalsy: true })
        .withMessage("Author name is required")
        .isString()
        .withMessage("Author name should be a string"),
    body("surname")
        .exists({ checkFalsy: true })
        .withMessage("Author surname is required")
        .isString()
        .withMessage("Author surname should be a string"),
])


module.exports = { authorEditDataValidate, authorPostDataValidate } 
