const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');

chai.use(sinonChai);
const { expect } = chai;

const authorsController = rewire('../app/controllers/authorsController');

describe('Authors Controller Unit Tests', () => {
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
            create: sinon.stub(),
            update: sinon.stub(),
            destroy: sinon.stub(),
        };
        PostsModelMock = {
            findAll: sinon.stub(),
            destroy: sinon.stub(),
        };

        authorsController.__set__('AuthorsModel', AuthorsModelMock);
        authorsController.__set__('PostsModel', PostsModelMock);
    });

    describe('getAllAuthors', () => {
        it('should return all authors with pagination', async () => {
            const authorsData = [{ id: 1, name: 'Author 1' }, { id: 2, name: 'Author 2' }];
            AuthorsModelMock.findAll.resolves(authorsData);

            req.query.page = 1;
            req.query.per_page = 10;

            await authorsController.getAllAuthors(req, res);

            expect(AuthorsModelMock.findAll).to.be.calledTwice;
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({
                authors: authorsData,
                totalPosts: authorsData.length,
                totalPages: 1,
                currentPage: 1,
            });
        });
        it('should handle 404 when authors are not found', async () => {
            AuthorsModelMock.findAll.resolves([]);

            await authorsController.getAllAuthors(req, res);

            expect(AuthorsModelMock.findAll).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No authors found.',
            });
        });
    });

    describe('getAuthorById', () => {
        it('should return a specific author by ID', async () => {
            const authorData = { id: 1, name: 'Author 1' };
            AuthorsModelMock.findOne.resolves(authorData);

            req.params.id = 1;

            await authorsController.getAuthorById(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnce;
            expect(res.json).to.be.calledWith(authorData);
        });
        it('should handle 404 when a specific author is not found', async () => {
            AuthorsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await authorsController.getAuthorById(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No author found by this id.',
            });
        });

    });
    describe('getAllAuthorsAndPosts', () => {
        it('should return all authors with their posts and pagination', async () => {
            const authorsData = [{ id: 1, name: 'Author 1' }, { id: 2, name: 'Author 2' }];
            const postsData = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];

            AuthorsModelMock.findAll.resolves(authorsData);
            PostsModelMock.findAll.resolves(postsData);

            await authorsController.getAllAuthorsAndPosts(req, res);
            expect(AuthorsModelMock.findAll).to.be.calledWith({ offset: 0, limit: 10, include: [{ model: PostsModelMock }] });
            expect(res.status).to.be.calledWith(200);
        }),
            it('should handle 404 when authors and posts are not found', async () => {
                AuthorsModelMock.findAll.resolves([]);
                AuthorsModelMock.findAll.onSecondCall().resolves([]);

                req.query.page = 1;
                req.query.per_page = 10;

                await authorsController.getAllAuthorsAndPosts(req, res);

                expect(AuthorsModelMock.findAll).to.be.calledOnce;
                expect(res.status).to.be.calledWith(404);
                expect(res.json).to.be.calledWith({
                    message: 'No authors found.',
                });
            });


    });

    describe('getAuthorAndPostsById', () => {
        it('should return a specific author with their posts by ID', async () => {
            const authorData = { id: 1, name: 'Author 1' };
            const postsData = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
            AuthorsModelMock.findOne.resolves(authorData);
            PostsModelMock.findAll.resolves(postsData);

            req.params.id = 1;

            await authorsController.getAuthorAndPostsById(req, res);
            expect(AuthorsModelMock.findOne).to.be.calledWith({ where: { id: 1 }, include: [{ model: PostsModelMock }] });
        });
        it('should handle 404 when a specific author and their posts are not found', async () => {
            AuthorsModelMock.findOne.resolves(null);
            PostsModelMock.findAll.resolves(null);

            req.params.id = 1;

            await authorsController.getAuthorAndPostsById(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({
                message: 'No author found by this id.'
            });
        });

    });

    describe('createAuthor', () => {
        it('should create a new author', async () => {
            const newAuthorData = { name: 'New Author', surname: 'Surname' };
            const createdAuthor = { id: 1, ...newAuthorData };
            AuthorsModelMock.create.resolves(createdAuthor);

            req.body = newAuthorData;

            await authorsController.createAuthor(req, res);

            expect(AuthorsModelMock.create).to.be.calledOnceWith({
                name: newAuthorData.name,
                surname: newAuthorData.surname,
                created_at: sinon.match.string,
                updated_at: sinon.match.string,
            });
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Author created succesfully', id: createdAuthor.id });
        });


    });
    describe('editAuthor', () => {
        it('should edit an existing author', async () => {
            const editedAuthorData = { name: 'Edited Author', surname: 'Surname' };
            const authorToEdit = { id: 1, name: 'Original Author', surname: 'Original Surname' };
            AuthorsModelMock.findOne.resolves(authorToEdit);
            AuthorsModelMock.update.resolves([1]);

            req.params.id = 1;
            req.body = editedAuthorData;

            await authorsController.editAuthor(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(AuthorsModelMock.update).to.be.calledOnceWith(
                { name: editedAuthorData.name, surname: editedAuthorData.surname, updated_at: sinon.match.string },
                { where: { id: req.params.id } }
            );
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Author edited succesfully', id: authorToEdit.id });
        });


        it('should return a 404 error if author to edit is not found', async () => {
            AuthorsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await authorsController.editAuthor(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnce;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({ message: 'No author found by this id.' });
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Validation error');
            validationError.name = 'ValidationError';
            AuthorsModelMock.findOne.resolves({ id: 1, name: 'Original Author', surname: 'Surname' });
            AuthorsModelMock.update.rejects(validationError);

            req.body = { name: '', surname: '' };
            req.params.id = 1;

            await authorsController.editAuthor(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnceWith({ where: { id: 1 } });
            expect(AuthorsModelMock.update).to.be.calledOnceWith({ name: '', surname: '', updated_at: new Date().toLocaleString() }, { where: { id: 1 } });
            expect(res.json).to.be.calledWith({

                error: 'Error updating author'
            });
        });
    });

    describe('deleteAuthor', () => {
        it('should delete an existing author', async () => {
            const authorToDelete = { id: 1, name: 'Author to Delete' };
            AuthorsModelMock.findOne.resolves(authorToDelete);
            PostsModelMock.destroy.resolves(1);
            AuthorsModelMock.destroy.resolves(1);

            req.params.id = 1;

            await authorsController.deleteAuthor(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(PostsModelMock.destroy).to.be.calledOnceWith({
                where: { author_id: req.params.id }
            });
            expect(AuthorsModelMock.destroy).to.be.calledOnceWith({
                where: { id: req.params.id }
            });
            expect(res.status).to.be.calledWith(200);
            expect(res.json).to.be.calledWith({ msg: 'Author deleted succesfully', id: authorToDelete.id });
        });

        it('should return a 404 error if author to delete is not found', async () => {
            AuthorsModelMock.findOne.resolves(null);

            req.params.id = 1;

            await authorsController.deleteAuthor(req, res);

            expect(AuthorsModelMock.findOne).to.be.calledOnce;
            expect(PostsModelMock.destroy).not.to.be.called;
            expect(AuthorsModelMock.destroy).not.to.be.called;
            expect(res.status).to.be.calledWith(404);
            expect(res.json).to.be.calledWith({ message: 'No author found by this id.' });
        });
    });
});