const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');

const expect = chai.expect

chai.use(sinonChai);

const routerModule = rewire('../routes/posts');

describe('Express CRUD for posts unit tests', () => {
    let req, res, sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        req = {
            query: {},
            params: {},
            body: {},
        };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub(),
        };
        next = sandbox.stub();
    });

    afterEach(() => {
        sandbox.reset();
    });

    it('should return a list of posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const posts = [
            {
                id: 1,
                title: 'Posts',
                body: "Post body",
                author_id: 1,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            },
            {
                id: 2,
                title: 'Posts',
                body: "Post body",
                author_id: 2,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            },
        ];
        const per_page = 2;
        const totalPages = Math.ceil(posts.length / per_page);

        dbStub.all.withArgs('SELECT * FROM Posts').yields(null, posts);

        req.query = { page: 1, per_page: 2 };
        res.send.callsFake((data) => {
            expect(data).to.have.property('posts').that.deep.equals(posts);
            expect(data).to.have.property('totalposts', posts.length);
            expect(data).to.have.property('currentPage', 1);
            expect(data).to.have.property('totalPages', totalPages);
            expect(res.status).to.be.calledWith(200);

        });


        done()
    });

    it('should return error when no posts found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs('SELECT * FROM Posts').yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });


        done()
    });

    it('should handle error when getting Posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs('SELECT * FROM Posts').yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should return a single post', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const post = {
            id: 2,
            title: 'Posts',
            body: "Post body",
            author_id: 2,
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
        };

        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = ${post.id}`).yields(null, post);

        res.send.callsFake((data) => {
            expect(data).to.have.property('post').that.deep.equals(post);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when post is found', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error', 'posts not found.');
            expect(res.status).to.be.calledWith(404);

        });

        done()
    });

    it('should handle error when getting post', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should return a list of posts and their authors', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const posts = [
            {
                id: 1,
                title: 'Posts',
                body: "Post body",
                author_id: 1,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
                author: {
                    id: 1,
                    name: 'John',
                    surname: "Doe",
                    created_at: new Date().toLocaleString(),
                    updated_at: new Date().toLocaleString(),
                }
            },
            {
                id: 2,
                title: 'Posts2',
                body: "Posts body2",
                author_id: 2,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
                author: {
                    id: 2,
                    name: 'Johns',
                    surname: "Does",
                    created_at: new Date().toLocaleString(),
                    updated_at: new Date().toLocaleString(),
                }
            },
        ];

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_object(
            'id', id,
            'name', name,
            'surname', surname,
            'created_at', created_at,
            'updated_at', updated_at
        ) FROM Authors
        WHERE id = Posts.author_id) AS author
        FROM Posts
    `).yields(null, posts);

        res.send.callsFake((data) => {
            expect(data).to.have.property('posts').that.deep.equals(posts);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when no posts found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_object(
            'id', id,
            'name', name,
            'surname', surname,
            'created_at', created_at,
            'updated_at', updated_at
        ) FROM Authors
        WHERE id = Posts.author_id) AS author
        FROM Posts
    `).yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });


        done()
    });

    it('should handle error when getting posts and their authors', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_object(
            'id', id,
            'name', name,
            'surname', surname,
            'created_at', created_at,
            'updated_at', updated_at
        ) FROM Authors
        WHERE id = Posts.author_id) AS author
        FROM Posts
    `).yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });


    it('should return a single post and the author', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        const post =
        {
            id: 1,
            title: 'Posts',
            body: "Post body",
            author_id: 1,
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
            author: {
                id: 1,
                name: 'John',
                surname: "Doe",
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            }
        };


        dbStub.all.withArgs(`SELECT * FROM Posts WHEN id = ${post.id}`).yields(null, post);
        dbStub.get.withArgs(`SELECT * FROM Authors WHEN id = ${post.author_id}`).yields(null, post.author);

        res.send.callsFake((data) => {
            expect(data).to.have.property('post').that.deep.equals(post);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when post is found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, {});
        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, []);

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });

        done()
    });

    it('should handle error when getting posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, {});
        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, []);

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should post a post to the database', (done) => {
        const dbStub = {
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const post = {
            id: 1,
            title: 'Posts',
            body: "Post body",
            author_id: 1,
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
        };

        dbStub.run.withArgs(`INSERT INTO Posts (title, body, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`, post).yields(null, post)

        res.send.callsFake((data) => {
            expect(res.json).to.be.calledWith({
                id: post.id,
            })
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when there is input missing', (done) => {
        const dbStub = {
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.run.withArgs(`INSERT INTO authors (title, body, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`).yields(new Error('DB error'), null)

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(400);

        });

        done()
    });

    it('should handle error when creating posts', (done) => {
        const dbStub = {
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.run.withArgs(`INSERT INTO authors (title, body, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should update post in the database', (done) => {
        const dbStub = {
            run: sandbox.stub(),
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const postId = 1

        const postUpdate = {
            title: 'Post',
            body: "New Post",
            updated_at: new Date().toLocaleString(),
        };

        dbStub.get.withArgs(`SELECT * FROM Posts WHERE id = 1`, postId).yields(null, postId)
        dbStub.run.withArgs(`UPDATE Posts SET ${postUpdate.name} ${postUpdate.surname} updated_at = "${postUpdate.updated_at}" WHERE id = ${postId}`, postUpdate).yields(null, postUpdate)

        res.send.callsFake(() => {
            expect(res.json).to.be.calledWith({
                id: postId,
            })
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when both inputs are missing', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Posts WHERE id = 2`).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`UPDATE Posts SET undefined undefined updated_at = "2023-08-01" WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(400);

        });

        done()
    });

    it('should handle error when updating posts', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Posts WHERE id = `).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`UPDATE Posts SET undefined undefined updated_at = "2023-08-01" WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should delete post from the database', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const postId = {
            id: 1,
        };

        dbStub.get.withArgs(`SELECT * FROM Posts WHERE id = ${postId}`, postId).yields(null, postId)
        dbStub.run.withArgs(`DELETE FROM Posts WHERE id = ${postId}`, postId).yields(null, postId)

        res.send.callsFake((data) => {
            expect(res.json).to.be.calledWith({
                id: postId,
            })
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should handle error when deleting posts', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Posts WHERE id = 2`).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`DELETE FROM Posts WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);
        });

        done()
    });
});