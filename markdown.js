const MarkdownIt = require("markdown-it")
const hljs = require("highlight.js")
const path = require("path")
const fs = require("fs")
const ejs = require("ejs")

// Markdown renderer
const md = MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: "language-",
    quotes: "“”‘’",
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }
  
      return ''; // use external default escaping
    }
})

/**
 * Retrieve file's name (remove ext).
 * @returns file's name.
 */
function getFileName(file) {
    return file.replace(path.extname(file), '')
}

/**
 * Load html templates.
 * @returns Object contains {template name : template}
 */
 function loadTemplates() {
    const templatesDir = path.join(__dirname, "templates")
    templates = {}
    console.log("Loading template htmls...")
    fs.readdirSync(templatesDir).map((v, i, arr)=>{console.log(v)})
    fs.readdirSync(templatesDir).map((v, i, arr) => {
        templates[getFileName(v)] = fs.readFileSync(path.join(templatesDir, v), "utf-8")
    })
    console.log("Done!")
    return templates
}

/**
 * Render markdowns in ./contents into html and generate them into ./deploy
 */
function renderMarkdowns() {
    const deployDir = path.join(__dirname, "deploy")
    const mdContentsDir = path.join(__dirname, "contents")
    if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir)
    }
    
    const templates = loadTemplates()
    fs.readdirSync(mdContentsDir).map((v, i, arr) => {
        console.log(`Deploying content '${v}'...`)
        let content = fs.readFileSync(path.join(mdContentsDir, v), "utf-8")
        let templateType = content.match(/<type:(\w+)>.*/)[1]
        // console.log(`templateType = ${templateType}`)
        content = content.replace(`<type:${templateType}>`, '')
        // console.log(`md content = \n---\n${content}\n---`)
        let convertedMd = md.render(content)
        let filename = getFileName(v)
        let html = ejs.render(templates[templateType], {name: filename, content: convertedMd})

        let deployPath = path.join(deployDir, `${filename}.html`)
        fs.writeFileSync(deployPath, html)
        console.log(`Done! -> '${deployPath}'`)
    })

    let deployedFiles = fs.readdirSync(deployDir)
    console.log(`Deployed ${deployedFiles.length} files :`)
    deployedFiles.map((v, i, arr) => console.log(`${i+1} : ${v}`))
}

module.exports.renderMarkdowns  = renderMarkdowns
module.exports.loadTemplates = loadTemplates
module.exports.getFileName = getFileName