const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const AuthorsModel = sequelize.define('authors', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true,
    },
    created_at: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

}, { timestamps: false })


const PostsModel = sequelize.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

}, { timestamps: false })

PostsModel.belongsTo(AuthorsModel, { foreignKey: 'author_id', targetKey: 'id' });
AuthorsModel.hasMany(PostsModel, { foreignKey: 'author_id', sourceKey: 'id' });

(async () => {
    await sequelize.sync()
})()

module.exports = {
    AuthorsModel,
    PostsModel
}



