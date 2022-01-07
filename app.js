const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const database = require("./database");

const Task = require("./models/Task");
const TaskModel = Task.model;

const List = require("./models/List");
const ListModel = List.model;

const myDate = require("./myDate");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, resp) => {
    TaskModel.getAllTasks()
        .then((allTasks) => {
            resp.render("list", {
                listTitle: myDate.longDate,
                allTasks: allTasks
            });
        });
});

app.post('/', (req, resp) => {
    const taskName = req.body.newTask;
    const listName = req.body.listName;

    const task = new TaskModel({
        name: taskName
    });

    if (listName === myDate.longDate) {
        console.log("Added to tasks collection");
        task.save()
            .then((_) => {
                resp.redirect('/');
            })
            .catch((error) => {
                console.log("Error: Cannot add task to DB.");
                console.log(error.message);

                // Handle Error.
                resp.redirect('/');
            });
    }
    else {
        ListModel.findListByName(listName)
            .then((found) => {
                if (found !== null) {
                    // List present in DB.
                    found.addTask(task);
                }
                resp.redirect(`/${listName}`);
            });
    }


});

app.post('/remove', (req, resp) => {
    const checkedTaskId = req.body.checkedTask;
    const listName = req.body.listName;

    if (listName === myDate.longDate) {
        TaskModel.removeTaskById(checkedTaskId)
            .then((removed) => {
                if (removed) {
                    // Task successfully removed from DB.
                    resp.redirect('/');
                }
                else {
                    // Handle Error: Task cannot be removed from DB.
                    resp.redirect('/');
                }
            });
    }
    else {
        ListModel.removeTaskFromList(listName, checkedTaskId)
            .then((removed) => {
                if (removed) {
                    // Task successfully removed from list.
                    resp.redirect(`/${listName}`);
                }
                else {
                    // Handle Error: Task cannot be removed from list.
                    resp.redirect(`/${listName}`);
                }
            });
    }
});

app.get('/:customListName', (req, resp) => {
    const customListName = _.capitalize(req.params.customListName);

    ListModel.findListByName(customListName)
        .then((found) => {
            if (found !== null) {
                // List present in DB.
                resp.render("list", {
                    listTitle: found.name,
                    allTasks: found.tasks
                });
            }
            else {
                // List doesn't exist. Create a new list.
                const newList = new ListModel({
                    name: customListName,
                    tasks: []
                });

                // Add it to collection.
                newList.save()
                    .then((_) => {
                        // List added to DB.
                        resp.render("list", {
                            listTitle: customListName,
                            allTasks: []
                        });
                    })
                    .catch((error) => {
                        console.log("Error: Cannot add list to DB.");
                        console.log(error.message);
                        // Handle Error.
                        resp.redirect('/');
                    });
            }
        });


});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port " + (process.env.PORT || 3000));
});