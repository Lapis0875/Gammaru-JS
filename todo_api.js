const { Console } = require("console")
const fs = require("fs")
const { Todo } = require("./models/todo")
const { setInterval } = require("timers/promises")
const todo = require("./models/todo")

function jsonStringifyDebugger(key, value) {
    console.log(`jsonStringifyDebugger(${key}, (${typeof value}) ${value})`)
    return value
}

class TodoAPI{
    constructor(dataPath) {
        this.dataPath = dataPath
        this.cache = []
        this.load()
        // setInterval(this.save(), 60 * 60 * 1000)
        setInterval(this.save(), 1000)
    }

    load() {
        console.log("Loading todos...")
        let data = JSON.parse(fs.readFileSync(this.dataPath))
        data.todos.map(v => {
            console.log(v);
            this.cache.push(new Todo(v.id, v.name, v.due, v.finished))
        })
        console.log("Loaded!")
    }

    save() {
        console.log("Saving todo data...")
        let data = {
            updated: new Date().toLocaleString(),
            todos: this.cache
        }
        console.log(data)
        let stringData = JSON.stringify(data, null, 4)
        console.log(stringData)
        fs.writeFileSync(this.dataPath, stringData)
        console.log("Saved!")
    }

    /**
     * Get a list of Todos
     * @returns Todo[] array of currently stored Todos.
     */
    totalList() {
        return this.cache
    }

    /**
     * Get a list of unfinished Todos
     * @returns Todo[] array of currently stored & unfinished Todos.
     */
    todoList() {
        return this.cache.filter(v => !v.finished)
    }

    /**
     * Create new Todo object.
     * @param {String} name Name of this todo.
     * @param {Date} due Due date of this todo.
     * @param {boolean} finished If this todo is finished or not.
     * @returns {Todo} Created todo object.
     */
    create(name, due, finished) {
        let lastIndex = this.cache.reduce((prev, cur) => {
            // console.log(`reduce(${prev}, ${cur.id})`)
            if (prev < cur.id)
                return cur.id
            return prev
        }, 0)
        // console.log(`New Todo's index : ${lastIndex}`)
        let t = new todo.Todo(lastIndex + 1, name, due, finished)
        this.cache.push(t)
        return t
    }

    /**
     * Get Todo of given id.
     * @param {Number} id id of Todo object.
     * @returns 
     */
    get(id) {
        return this.cache.filter(v => v.id === id)[0]
    }

    /**
     * Finish Todo of given id.
     * @param {Number} id id of Todo object.
     */
    finish(id) {
        this.get(id).finish()
    }

    /**
     * 
     * @param {Number} id 
     * @param {*} data 
     */
    edit(id, data) {
        let t = this.get(id)
        if ("name" in data)
        {
            console.log(`Edit name of todo from ${t.name} to ${data["name"]}`)
            t.name = data["name"]
        }
        if ("due" in data)
        {    
            console.log(`Edit due of todo from ${t.due} to ${data["due"]}`)
            t.due = new Date(data["due"])
        }
        if ("finished" in data)
        {
            console.log(`Edit finished of todo from ${t.finished} to ${data["finished"]}`)
            t.finished = data["finished"]
        }
        return t
    }

    /**
     * Delete todo with id.
     * @param {Number} id 
     */
    delete(id) {
        this.cache.pop(id)
    }
}

api = new TodoAPI("./data/todos.json")

/**
 * Set router for express app.
 * @param {Express.Application} app : Express.Application 객체
 */
function route(app) {
    /**
     * Get list of unfinished todos.
     */
    app.get("/todo", (req, res) => {
        // api.todoList().map(v => console.log(`todoList entry (${v instanceof Todo}) ${v}`))
        res.json(api.todoList())
    })

    /**
     * Get todo of id.
     * Parameter id : id of todo to get.
     */
    app.get("/todo/:id", (req, res) => {
        console.log(`Get todo of id ${req.params.id}`)
        res.json(api.get(Number.parseInt(req.params.id)))
    })

    /**
     * Create new todo.
     * Body {name: String, due: String}
     */
    app.post("/todo/create", (req, res) => {
        console.log(`Create new todo with request body \n${JSON.stringify(req.body)}`)
        // 올바른 요청인지 검사
        if(!("name" in req.body) || !("due" in req.body)){
            let result = {}
            result["success"] = 0
            result["error"] = "Invalid request"
            res.json(result)
            return
        }
        let t = api.create(req.body["name"], new Date(req.body["due"]), "finished" in req.body ? req.body["finished"] : false)
        console.log(JSON.stringify(t, null, 2))
        res.json(t)
    })

    /**
     * Edit existing todo with id.
     * Parameter id : id of todo to edit.
     */
    app.put("/todo/edit/:id", (req, res) => {
        console.log(`Edit todo of id ${req.params.id}`)
        let edited = api.edit(Number.parseInt(req.params.id), req.body)
        console.log(JSON.stringify(edited, null, 2))
        res.json(edited)
    })

    /**
     * Delete existing todo with id.
     * Parameter id : id of todo to delete.
     */
    app.delete("/todo/delete/:id", (req, res) => {
        console.log(`Delete todo with id ${req.params.id}`)
        api.delete(Number.parseInt(req.params.id))
        res.json({"result": "Success"})
    })

    app.get("/todo/save", (req, res) => {
        console.log("Save todo data.")
        api.save()
        res.json({"result": "success"})
    })
}

module.exports.TodoAPI = api
module.exports.todoRoute = route