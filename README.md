# post-application-fullstack-full

Visit the post application here ➡️ https://post-application-full.netlify.app/

This is a fullstack app.

✔️ Frontend is build with Vite, made with, Vue, Vuex, Vue-router, CSS, hosted on Netlify and tested with Vue-test-utils and vitest. <br>
✔️ Backend is made with Express.js and socket.io, hosted on Heroku, documented with swagger, tested with mocha, chai, sinon and rewire. <br>
✔️ Database is hosted on ElephantSQL as a Postgresql database and a Sequelize ORM is used for it. <br>
✔️ Postman collections are included for testing the API.<br>

Functionalities include:
- Pagination for posts and authors
- Search for posts
- Fetching post and authors
- Creating, editing and deleting both posts and authors
- A notification system for when a post is edited, deleted or created with socket.io

**Test** 

To run the unit testing for the API run:

npm run test

**Documentation** 

The documentation can be accessed in the swagger.json file, or by running the server and opening:

http://localhost/3000/docs
