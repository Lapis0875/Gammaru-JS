const express = require("express")
const ejs = require("ejs")
const markdown = require("./markdown")

// express app
let app = express()
app.use(express.static("public"))
app.use(express.json())

// middleware to add `res.sendJsonExtra()` method to each request
// so other code can then call it as needed
function jsonExtra(req, res, next) {
    res.jsonDateOverride = function(obj) {
        obj.due = obj.due.to
        res.json(obj);    
    }
    next();
}

app.use(jsonExtra);

/** 
 * Initialize express app.
 * Add routers, set view engine, etc.
 * @param app : express app
*/
function expressInit(app) {
    const router = require("./route/main")
    app.set("views", "./deploy")
    app.set("view engine", "ejs")
    app.engine("html", ejs.renderFile)
    router.connectRoutes(app)

}


markdown.renderMarkdowns()
expressInit(app)
let server = app.listen(3000, () => {console.log("Express server has been started on port 3000.")})