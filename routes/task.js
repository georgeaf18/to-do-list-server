const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");


const router = express.Router();
const jsonParser = bodyParser.json();

const tasks = require("../dbao/taskDbao").tasks;

router.get("/", (req, res) => {
    tasks.getAllTasks().then(result => {
        res.send(result)
    })
})

router.get("/today/:id", jsonParser, (req, res) => {
    tasks.getTodaysTasks(req.params.id).then(result => {
        res.send(result);
    })
})

router.get("/upcoming/:id", jsonParser, (req, res) => {
    const userPK = req.params.id;
    const query = url.parse(req.url, true).query
    console.log("query upcoming", query.completed)


    tasks.getUpcomingTasks(userPK, query.completed).then(result => {
        res.send(result);
    })
})

router.get("/overdue/:id", jsonParser, (req, res) => {
    const userPK = req.params.id;
    const query = url.parse(req.url, true).query;
    console.log("query overdue", query.completed)

    tasks.getOverdueTasks(userPK, query.completed).then(result => {
        res.send(result);
    })

})

router.post("/", jsonParser, (req, res) => {

    const task = req.body.task
    console.log("task ->", task)

    task.priority = task.priority ? 1 : 0;

    console.log("task after ->", task)

    tasks.insertTask(task).then(result => {
        res.send(result)
    })
})

router.delete("/:id", jsonParser, (req, res) => {
    const pk = req.params.id;

    if (pk !== "") {
        tasks.deleteTask(pk).then(result => {
            res.send(result)
        })
    } else {
        res.status(404).send({ status: "error", message: "PK is empty" })
    }
})

router.put("/:id", jsonParser, (req, res) => {
    const pk = req.params.id;
    const task = req.body
    tasks.updateTask(pk, task).then(result => {
        res.send(result);
    })
})

module.exports = router;