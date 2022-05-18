const path = require("path")
const fs = require("fs")
const getFileName = require("../markdown").getFileName

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
    // app.get('/', (req, res) => {
    //     try {
    //         res.render(path.join(deployPath, "index.html"))
    //     } catch (e) {console.log(e)}
    // })
    // app.get('/about', (req, res) => {
    //     try {
    //         res.render(deployPath, "about.html")
    //     } catch (e) {console.log(e)}
    // })
}