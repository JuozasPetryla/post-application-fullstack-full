# post-application-fullstack-full

This is a fullstack app. Frontend is made with Vite, Vue, Vuex, Vue-router, CSS and tested with Vue-test-utils and vitest. 
Backend is made with Express.js and socket.io, documented with swagger, tested with mocha, chai, sinon and rewire.
SQLite is used as a database. Postman collections are included for testing the API.
Functionalities include:
- Pagination for posts and authors
- Search for posts
- Fetching post and authors
- Creating, editing and deleting both posts and authors
- A notification system for when a post is edited, deleted or created with socket.io

**Start** 

First of all navigate to both /server and /client files and run `npm install` on both of them.
To start the server navigate to /server run:

`npm run dev`

To start the app navigate to /client run:

`npm run dev`

The app should run on http://localhost/5173/

**Test** 

To run the unit testing for the API run:

npm run test

**Documentation** 

The documentation can be accessed in the swagger.json file, or by running the server and opening:

http://localhost5000/docs
