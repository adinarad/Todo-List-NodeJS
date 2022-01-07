const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

taskSchema.statics.getAllTasks = async function () {
    let tasks = [];

    try {
        tasks = await this.find({});
    } catch (error) {
        console.log("Error: Cannot fetch tasks from DB.");
        console.log(error.message);
    }
    return tasks;
};

// taskSchema.statics.saveNewTask = async function (task) {
//     try {
//         await task.save();
//         return true;
//     } catch (error) {
//         console.log("Error: Cannot add task to DB.");
//         console.log(error.message);
//     }
//     return false;
// };

taskSchema.statics.removeTaskById = async function (taskId) {
    try {
        await this.findByIdAndDelete(taskId);
        return true;
    } catch (error) {
        console.log("Error: Cannot delete task from DB.");
        console.log(error.message);
    }
    return false;
};

module.exports = {
    model: mongoose.model("Task", taskSchema),
    schema: taskSchema
};