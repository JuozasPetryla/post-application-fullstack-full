const express = require("express");
const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const http = require("http");
const socketIo = require("./socket");
const server = http.createServer(app);
const cors = require("cors");

require("dotenv").config();

socketIo.attach(server);

const corsOptions = {
  origin: [
    "https://post-application-full.netlify.app/",
    "https://post-application-f823a2a81cb3.herokuapp.com/",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authors API route
app.use("/api", require("./routes/authors"));
app.use("/api", require("./routes/posts"));

// Use Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
