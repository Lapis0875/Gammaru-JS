/**
 * Data model of Todo.
 */
class Todo {
    /**
     * Construct Todo Object.
     * @param {Number} id id of this Todo object.
     * @param {String} name name of todo.
     * @param {Date} due due datetime of todo.
     * @param {boolean} finished If this todo is finished or not.
     */
    constructor(id, name, due, finished) {
        this.id = id
        this.name = name
        this.due = due
        this.finished = finished
    }

    /**
     * Set this todo as finished.
     */
    finish() {
        this.finished = true
    }

    // toJson(key) {
    //     console.log(`Todo.toJson(${key})`)
    //     if (key === 'due')
    //     {
    //         return this.due.toLocaleString()
    //     }
    //     return super.toJson(key)
    // }
}

module.exports.Todo = Todo