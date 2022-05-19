const path = require("path")
const fs = require("fs")
const { todoRoute } = require("../todo_api")
const { getFileName } = require("../markdown")

deployPath = path.join(path.dirname(__dirname), "deploy")

routeDefaultHandler = (name) => (req, res) => {
    try {
        res.render(path.join(deployPath, `${name}.html`))
    } catch (e) {console.log(e)}
}

generateRoute = (app, name, func = routeDefaultHandler(name)) => {
    routePath = name === 'index' ? '/' : '/' + name
    console.log(`- Register route(${routePath})`)
    app.get(routePath, func)
}

module.exports.connectRoutes = (app) => {
    const deployedFiles = fs.readdirSync(deployPath)
    deployedFiles.map((v, i, arr) => {
        console.log(`Generate route for ${v}`)
        generateRoute(app, getFileName(v))
    })
    todoRoute(app)
}