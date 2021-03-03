const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
// const { v4: uuid } = require('uuid')
// const session = require("express-session");
// const randomString = require("./encrypt").genRandomString;
// const jwt = require("jsonwebtoken")
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
const tasksRoute = require("./routes/task");

app.use("/api/tasks", tasksRoute);



app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
