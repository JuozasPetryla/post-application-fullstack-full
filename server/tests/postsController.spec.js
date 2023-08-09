const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const { Op } = require('sequelize');


chai.use(sinonChai);
const { expect } = chai;

const postsController = rewire('../app/controllers/postsController');
describe('Posts Controller Unit Tests', () => {
    let req, res, AuthorsModelMock, PostsModelMock

    beforeEach(() => {
        req = {
            query: {},
            params: {},
            body: {},
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        AuthorsModelMock = {
            findAll: sinon.stub(),
            findOne: sinon.stub(),
        };
        PostsModelMock = {
            findAll: sinon.stub(),
            findOne: sinon.stub(),
            destroy: sinon.stub(),
            create: sinon.stub(),
            update: sinon.stub(),
            destroy: sinon.stub(),
        };

        postsController.__set__('AuthorsModel', AuthorsModelMock);
        postsController.__set__('PostsModel', PostsModelMock);
    });

    describe('getAllPosts', () => {
        it('should return all posts with pagination', async () => {
            const postsData = [{ id: 1, name: 'Post 1' }, { id: 2, name: 'Post 2' }];
            PostsModelMock.findAll.resolves(postsData);

            req.query.page = 1;
            req.query.per_page = 10;

            await postsController.getAllPosts(req, res);

            expect(PostsModelMock.findAll).to.be.calledTwice;
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({
                posts: postsData,
                totalPosts: postsData.length,
                totalPages: 1,
                currentPage: 1,
            });
        });
        it('should handle 404 when posts are not found', async () => {
            PostsModelMock.findAll.resolves([]);

            await postsController.getAllPosts(req, res);

            expect(PostsModelMock.findAll).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No posts found.',
            });
        });
    });

    describe('getPostById', () => {
        it('should return a specific post by ID', async () => {
            const postData = { id: 1, name: 'Post 1' };
            PostsModelMock.findOne.resolves(postData);

            req.params.id = 1;

            await postsController.getPostById(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnce;
            expect(res.json).to.be.calledWith(postData);
        });
        it('should handle 404 when a specific post is not found', async () => {
            PostsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await postsController.getPostById(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No post found by this id.',
            });
        });

    });
    describe('getAllPostsWithAuthors', () => {
        it('should return all posts with their authors and pagination, search', async () => {
            const authorsData = { id: 1, name: 'Author 1' };
            const postsData = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];

            AuthorsModelMock.findOne.resolves(authorsData);
            PostsModelMock.findAll.resolves(postsData);

            const { search } = req.query

            const searchQuery = {
                [Op.or]: [
                    { title: { [Op.like]: `%${search}%` } },
                    { content: { [Op.like]: `%${search}%` } }
                ]
            }

            await postsController.getAllPostsWithAuthors(req, res);
            expect(PostsModelMock.findAll).to.be.calledWith({ where: searchQuery });
            expect(res.status).to.be.calledWith(200);
        }),
            it('should handle 404 when posts and posts are not found', async () => {
                PostsModelMock.findAll.resolves([]);
                PostsModelMock.findAll.onSecondCall().resolves([]);

                req.query.page = 1;
                req.query.per_page = 10;

                await postsController.getAllPostsWithAuthors(req, res);

                expect(PostsModelMock.findAll).to.be.calledOnce;
                expect(res.status).to.be.calledWith(404);
                expect(res.json).to.be.calledWith({
                    message: 'No posts found.',
                });
            });


    });

    describe('getPostAndAuthorById', () => {
        it('should return a specific post with their posts by ID', async () => {
            const authorData = { id: 1, name: 'author 1' };
            const postsData = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
            AuthorsModelMock.findOne.resolves(authorData);
            PostsModelMock.findAll.resolves(postsData);

            req.params.id = 1;

            await postsController.getPostAndAuthorById(req, res);
            expect(PostsModelMock.findOne).to.be.calledWith({ where: { id: 1 }, include: [{ model: AuthorsModelMock }] });
        });
        it('should handle 404 when a specific post and their posts are not found', async () => {
            PostsModelMock.findOne.resolves(null);
            PostsModelMock.findAll.resolves(null);

            req.params.id = 1;

            await postsController.getPostAndAuthorById(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No post found by this id.'
            });
        });

    });

    describe('createPost', () => {
        it('should create a new post', async () => {
            const newPostData = { title: 'New Post', body: 'content', author_id: 1 };
            const createdPost = { id: 1, ...newPostData };
            PostsModelMock.create.resolves(createdPost);

            req.body = newPostData;

            await postsController.createPost(req, res);

            expect(PostsModelMock.create).to.be.calledOnceWith({
                title: newPostData.title,
                content: newPostData.body,
                author_id: newPostData.author_id,
                created_at: sinon.match.string,
                updated_at: sinon.match.string,
            });
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Post created succesfully', id: createdPost.id });
        });


    });
    describe('editPost', () => {
        it('should edit an existing post', async () => {
            const editedPostData = { title: 'Edited Post', content: 'content' };
            const postToEdit = { id: 1, title: 'Original Post', content: 'Original' };
            PostsModelMock.findOne.resolves(postToEdit);
            PostsModelMock.update.resolves([1]);

            req.params.id = 1;
            req.body = editedPostData;

            await postsController.editPost(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(PostsModelMock.update).to.be.calledOnceWith(
                { title: editedPostData.title, content: editedPostData.body, updated_at: sinon.match.string },
                { where: { id: req.params.id } }
            );
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Post edited succesfully', id: postToEdit.id });
        });


        it('should return a 404 error if post to edit is not found', async () => {
            PostsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await postsController.editPost(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({ message: 'No post found by this id.' });
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Validation error');
            validationError.title = 'ValidationError';
            PostsModelMock.findOne.resolves({ id: 1, title: 'Original Post', content: 'body' });
            PostsModelMock.update.rejects(validationError);

            req.body = { title: undefined, content: undefined };
            req.params.id = 1;

            await postsController.editPost(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnceWith({ where: { id: 1 } });
            expect(PostsModelMock.update).to.be.calledOnceWith({ title: undefined, content: undefined, updated_at: new Date().toLocaleString() }, { where: { id: 1 } });
            expect(res.json).to.be.calledWith({

                error: 'Error updating post'
            });
        });
    });

    describe('deletePost', () => {
        it('should delete an existing post', async () => {
            const postToDelete = { id: 1, name: 'Post to Delete' };
            PostsModelMock.findOne.resolves(postToDelete);
            PostsModelMock.destroy.resolves(1);
            PostsModelMock.destroy.resolves(1);

            req.params.id = 1;

            await postsController.deletePost(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(PostsModelMock.destroy).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(PostsModelMock.destroy).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Post deleted succesfully', id: postToDelete.id });
        });

        it('should return a 404 error if post to delete is not found', async () => {
            PostsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await postsController.deletePost(req, res);

            expect(PostsModelMock.findOne).to.be.calledOnce;
            expect(PostsModelMock.destroy).not.to.be.called;
            expect(PostsModelMock.destroy).not.to.be.called;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({ message: 'No post found by this id.' });
        });
    });
});