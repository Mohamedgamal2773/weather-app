const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const PORT = 3000;

let projectData = {
    temperature: "",
    date: "",
    userResponse: ""
};

// to enable cors requests
app.use(cors());

// to pase json body
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: false}));

app.get("/api/project", async (req, res) => {
    res.json(projectData);
});

app.post("/api/project", async (req, res) => {
    projectData = req.body;
    res.json(projectData);
});

app.use(express.static("website"));

const server = app.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
});