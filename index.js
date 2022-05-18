const express = require("express")
const ejs = require("ejs")
const markdown = require("./markdown")

// express app
let app = express();

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