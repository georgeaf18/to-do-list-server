const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "guest1",
    password: "guestpass",
    database: "my_todo_list"
});
const date = require("../date")

const tasks = {
    getAllTasks: () => {
        let sql = `SELECT * FROM tasks`;
        return new Promise((resolve, reject) => {
            const tasks = [];

            connection.query(sql, function (err, rows) {
                if (err) throw err;

                rows.forEach(row => {
                    tasks.push(populateTask(row));
                });

                resolve(tasks);
            });
        });
    },

    getTodaysTasks: (userPK) => {
        let sql = `SELECT * FROM tasks WHERE userPK = ${userPK} AND date = '${date.getToday()}';`;
        try {
            return new Promise((resolve, reject) => {
                const tasks = [];

                connection.query(sql, function (err, rows) {
                    if (err) throw err;

                    rows.forEach(row => {
                        tasks.push(populateTask(row));
                    });

                    resolve(tasks);
                });
            });
        } catch (e) {
            console.log("Error: taskDbao.getTodaysTasks() -> ", e);
        }
    },
    getOverdueTasks: (userPK, completed) => {
        let sql = `SELECT * FROM tasks WHERE userPK = ${userPK} 
        AND date < '${date.getToday()}' `;

        if (completed != undefined) {
            sql += `AND completed = ${completed == 'true' ? 1 : 0}`;
        }

        sql += ";";

        try {
            return new Promise((resolve, reject) => {
                const tasks = [];
                connection.query(sql, function (err, rows) {
                    if (err) throw err;

                    rows.forEach(row => {
                        tasks.push(populateTask(row));
                    });

                    resolve(tasks);
                });
            });
        } catch (e) {
            console.log("Error: taskDbao.getOverdueTasks() -> ", e);
        }
    },

    getUpcomingTasks: (userPK, completed) => {
        let sql = `SELECT * FROM tasks WHERE userPK = ${userPK} AND date > '${date.getToday()}'`;

        if (completed != undefined) {
            sql += ` AND completed = ${completed == 'true' ? 1 : 0}`;
        }

        sql += " ;";
        console.log("sql", sql)

        try {
            return new Promise((resolve, reject) => {
                const tasks = [];
                connection.query(sql, (err, rows) => {
                    if (err) throw err;

                    rows.forEach(row => {




                        if (tasks.length > 0) {
                            let foundMatch = false;
                            for (let t of tasks) {
                                if (t.date === row.date) {
                                    t.tasks.push(populateTask(row))
                                    foundMatch = true;
                                }
                            }

                            if (!foundMatch) {
                                tasks.push(createNewTimeFrame(row));
                            }
                        } else {
                            tasks.push(createNewTimeFrame(row));
                            console.log("Tasks: taskDbao.getUpcomingTasks() -> AFTER 1st ", tasks);
                            // tasks[key] = value;
                        }
                    })
                    console.log("Tasks: taskDbao.getUpcomingTasks() -> ", tasks);

                    resolve(tasks)
                })
            })
        } catch (e) {
            console.log("Error: taskDbao.getUpcomingTasks() -> ", e);

        }
    },

    insertTask: task => {
        let sql = `insert into tasks 
        (task, date, label, userPK, priority ) 
        values ( '${task.task}', '${task.date}', '${task.label}', ${task.userPK}, ${task.priority} );`;

        return new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (!err) {
                    resolve({ status: "success" });
                } else {
                    resolve({ status: "error", err: err });
                }
            });
        });
    },

    updateTask: (pk, task) => {
        let sql = `UPDATE tasks
    	SET task = '${task.task}',
            date = '${task.date}',
            completed = ${task.completed ? 1 : 0},
            label = '${task.label}',
            priority = ${task.priority ? 1 : 0}
    	 WHERE pk = ${connection.escape(pk)};

    	 `;

        return new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (!err) {
                    resolve({ status: "success" });
                } else {
                    resolve({ status: "error", err: err });
                }
            });
        });
    },

    deleteTask: (id) => {
        let sql = `DELETE FROM tasks WHERE pk = ${id} LIMIT 1;`;

        return new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (!err) {
                    resolve({ status: "success" });
                } else {
                    resolve({ status: "error", err: err });
                }
            });
        });
    }
};

const populateTask = row => {
    const task = {
        pk: row.pk,
        task: row.task,
        completed: row.completed === 1,
        date: row.date,
        label: row.label,
        priority: row.priority === 1
    };

    return task;
};

const createNewTimeFrame = row => {
    const taskFrame = {};
    let tasksToPush = [];

    taskFrame["date"] = row.date;
    tasksToPush.push(populateTask(row));
    taskFrame["tasks"] = tasksToPush
    // tasks.push(taskFrame);
    return taskFrame;
}

module.exports = { tasks: tasks };
