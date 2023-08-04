const express = require('express')
const app = express()

const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./swagger.json')

const http = require('http');
const socketIo = require('./socket');
const server = http.createServer(app);
const cors = require('cors');


// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));

socketIo.attach(server);


// Authors API route
app.use('/api', require('./routes/authors'))
app.use('/api', require('./routes/posts'))

// Connects to client

const path = '/home/studentas/Posts-application-full/client/';
app.use(express.static(path));
app.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});


// Use Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))

