const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');

const expect = chai.expect

chai.use(sinonChai);

const routerModule = rewire('../routes/authors');

describe('Express CRUD for authors unit tests', () => {
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

    it('should return a list of authors', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const authors = [
            {
                id: 1,
                name: 'John',
                surname: "Doe",
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            },
            {
                id: 1,
                name: 'John',
                surname: "Doe",
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            },
        ];
        const per_page = 2;
        const totalPages = Math.ceil(authors.length / per_page);

        dbStub.all.withArgs('SELECT * FROM Authors').yields(null, authors);

        req.query = { page: 1, per_page: 2 };
        res.send.callsFake((data) => {
            expect(data).to.have.property('authors').that.deep.equals(authors);
            expect(data).to.have.property('totalAuthors', authors.length);
            expect(data).to.have.property('currentPage', 1);
            expect(data).to.have.property('totalPages', totalPages);
            expect(res.status).to.be.calledWith(200);

        });


        done()
    });

    it('should return error when no authors found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs('SELECT * FROM Authors').yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });


        done()
    });

    it('should handle error when getting authors', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs('SELECT * FROM Authors').yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should return a single author', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const author = {
            id: 1,
            name: 'John',
            surname: "Doe",
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString()
        };

        dbStub.get.withArgs(`SELECT * FROM Authors WHEN id = ${author.id}`).yields(null, author);

        res.send.callsFake((data) => {
            expect(data).to.have.property('author').that.deep.equals(author);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when author is found', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Authors WHEN id = 2`).yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error', 'Authors not found.');
            expect(res.status).to.be.calledWith(404);

        });

        done()
    });

    it('should handle error when getting author', (done) => {
        const dbStub = {
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Authors WHEN id = 2`).yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should return a list of authors and list of their posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const authors = [
            {
                id: 1,
                name: 'John',
                surname: "Doe",
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
                posts: [
                    {
                        id: 1,
                        title: 'Post',
                        body: 'Post body',
                        author_id: 1,
                        created_at: new Date().toLocaleString(),
                        updated_at: new Date().toLocaleString(),
                    }
                ]
            },
            {
                id: 1,
                name: 'John',
                surname: "Doe",
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
                posts: []
            },
        ];

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_group_array(
            json_object(
                'id', id,
                'title', title,
                'body', body, 
                'author_id', author_id, 
                'created_at', created_at, 
                'updated_at', updated_at)) AS posts
            FROM Posts
            WHERE author_id = Authors.id) AS posts
            FROM Authors;`).yields(null, authors);

        res.send.callsFake((data) => {
            expect(data).to.have.property('authors').that.deep.equals(authors);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when no authors found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_group_array(
            json_object(
                'id', id,
                'title', title,
                'body', body, 
                'author_id', author_id, 
                'created_at', created_at, 
                'updated_at', updated_at)) AS posts
            FROM Posts
            WHERE author_id = Authors.id) AS posts
            FROM Authors;`).yields(null, []);

        res.json.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });


        done()
    });

    it('should handle error when getting authors and their posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`
        SELECT *, (SELECT json_group_array(
            json_object(
                'id', id,
                'title', title,
                'body', body, 
                'author_id', author_id, 
                'created_at', created_at, 
                'updated_at', updated_at)) AS posts
            FROM Posts
            WHERE author_id = Authors.id) AS posts
            FROM Authors;`).yields(new Error('DB error'), null);

        res.json.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });


    it('should return a single author and his posts', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        const author = {
            id: 1,
            name: 'John',
            surname: "Doe",
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
            posts: [
                {
                    id: 1,
                    title: 'Post',
                    body: 'Post body',
                    author_id: 1,
                    created_at: new Date().toLocaleString(),
                    created_at: new Date().toLocaleString(),
                }
            ]
        };

        dbStub.all.withArgs(`SELECT * FROM Authors WHEN id = ${author.id}`).yields(null, author);
        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = ${author.posts.author_id}`).yields(null, author.posts);

        res.send.callsFake((data) => {
            expect(data).to.have.property('author').that.deep.equals(author);
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should return error when author is found', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`SELECT * FROM Authors WHEN id = 2`).yields(null, {});
        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, []);

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(404);

        });

        done()
    });

    it('should handle error when getting authors', (done) => {
        const dbStub = {
            all: sandbox.stub(),
            get: sandbox.stub()
        };
        routerModule.__set__('db', dbStub);

        dbStub.all.withArgs(`SELECT * FROM Authors WHEN id = 2`).yields(null, {});
        dbStub.get.withArgs(`SELECT * FROM Posts WHEN id = 2`).yields(null, []);

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should post author to the database', (done) => {
        const dbStub = {
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const author = {
            id: 1,
            name: 'John',
            surname: "Doe",
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
        };

        dbStub.run.withArgs(`INSERT INTO authors (name, surname, created_at, updated_at) VALUES (?, ?, ?, ?)`, author).yields(null, author)

        res.send.callsFake((data) => {
            expect(res.json).to.be.calledWith({
                id: author.id,
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

        dbStub.run.withArgs(`INSERT INTO authors (name, surname, created_at, updated_at) VALUES (?, ?, ?, ?)`).yields(new Error('DB error'), null)

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(400);

        });

        done()
    });

    it('should handle error when creating authors', (done) => {
        const dbStub = {
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.run.withArgs(`INSERT INTO authors (name, surname, created_at, updated_at) VALUES (?, ?, ?, ?)`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should update author in the database', (done) => {
        const dbStub = {
            run: sandbox.stub(),
            get: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const authorId = 1

        const authorUpdate = {
            name: 'John',
            surname: "Doe",
            updated_at: new Date().toLocaleString(),
        };

        dbStub.get.withArgs(`SELECT * FROM Authors WHERE id = 1`, authorId).yields(null, authorId)
        dbStub.run.withArgs(`UPDATE Authors SET ${authorUpdate.name} ${authorUpdate.surname} updated_at = "${authorUpdate.updated_at}" WHERE id = ${authorId}`, authorUpdate).yields(null, authorUpdate)

        res.send.callsFake(() => {
            expect(res.json).to.be.calledWith({
                id: authorId,
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

        dbStub.get.withArgs(`SELECT * FROM Authors WHERE id = 2`).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`UPDATE Authors SET undefined undefined updated_at = "2023-08-01" WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake((data) => {
            expect(data).to.have.property('error');
            expect(res.status).to.be.calledWith(400);

        });

        done()
    });

    it('should handle error when updating authors', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Authors WHERE id = `).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`UPDATE Authors SET undefined undefined updated_at = "2023-08-01" WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);

        });

        done()
    });

    it('should delete author from the database', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        const authorId = {
            id: 1,
        };

        dbStub.get.withArgs(`SELECT * FROM Authors WHERE id = ${authorId}`, authorId).yields(null, authorId)
        dbStub.run.withArgs(`DELETE FROM Authors WHERE id = ${authorId}`, authorId).yields(null, authorId)

        res.send.callsFake((data) => {
            expect(res.json).to.be.calledWith({
                id: authorId,
            })
            expect(res.status).to.be.calledWith(200);

        });

        done()
    });

    it('should handle error when deleting authors', (done) => {
        const dbStub = {
            get: sandbox.stub(),
            run: sandbox.stub(),
        };
        routerModule.__set__('db', dbStub);

        dbStub.get.withArgs(`SELECT * FROM Authors WHERE id = 2`).yields(new Error('DB error'), null)
        dbStub.run.withArgs(`DELETE FROM Authors WHERE id = 2`).yields(new Error('DB error'), null)

        res.send.callsFake(() => {
            expect(res.status).to.be.calledWith(500);
        });

        done()
    });
});
