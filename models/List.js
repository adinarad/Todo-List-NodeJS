const mongoose = require("mongoose");
const TaskSchema = require("./Task").schema;

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tasks: {
        type: [TaskSchema],
        default: []
    }
});

listSchema.methods.addTask = async function (task) {
    this.tasks.push(task);

    try {
        await this.save();
    } catch (error) {
        console.log("Error: Cannot add task to DB.");
        console.log(error.message);
    }
}

listSchema.statics.removeTaskFromList = async function (listName, taskId) {
    try {
        await this.findOneAndUpdate({ name: listName }, { $pull: { tasks: { _id: taskId } } });
        return true;
    }
    catch (error) {
        console.log("Error: Cannot delete task from list.");
        console.log(error.message);
    }
    return false;
}

listSchema.statics.findListByName = async function (listName) {
    try {
        const list = await this.findOne({ name: listName });

        if (list == null) {
            // List doesn't exist in DB.
            return null;
        }
        else {
            // List already exists.
            return list;
        }
    } catch (error) {
        console.log("Error: Cannot find list in DB");
        console.log(error.message);
    }
    return null;
};

module.exports.model = mongoose.model("List", listSchema);