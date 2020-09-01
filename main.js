const fs = require("fs")
var paths = []
var filePaths = []
var fileName = []

// Détection des Dossiers
async function loadDirs(path = "./files") {
    const dirs = await fs.promises.opendir(path)
    for await (const dir of dirs) {
        if(dir.isDirectory()) {
            if(!paths.includes(`${path}/${dir.name}`)) {
                loadDirs(`${path}/${dir.name}`)
                paths.push(`${path}/${dir.name}`)
                console.log(paths[paths.length - 1])
            }
        } else loadFiles()
    }
}
// Détection des Fichiers
async function loadFiles() {
    for(var i = 0; i < paths.length; i++) {
        const files = await fs.promises.opendir(paths[i])
        for await (const file of files) {
            if(file.isFile()) {
                if(!filePaths.includes(`${paths[i]}/${file.name}`)) {
                    filePaths.push(`${paths[i]}/${file.name}`)
                    fileName.push(file.name)
                    console.log(filePaths[filePaths.length - 1])
                    sortFile(filePaths.length - 1)
                }
            } else loadDirs()
        }
    }
}

// Tri des Fichiers
function sortFile(y) {
    fs.stat(filePaths[y], function(err, stats){
        var date = stats.mtime.toDateString()
        fs.mkdir(`./sort/${date}`, function (err) {
            if(!err || (err && err.code === 'EEXIST')) {
                fs.copyFile(filePaths[y], `./sort/${date}/${fileName[y]}`, function(err) {
                    if(err) console.log(err)
                })
            }
        })
    })
}

console.log("Sort Initialized...")
loadDirs()