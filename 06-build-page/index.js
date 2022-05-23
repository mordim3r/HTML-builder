const fs = require('fs') 
const path = require('path') 
const projectPath = path.join(__dirname, 'project-dist') 
const pathToTemplate = path.join(__dirname, 'template.html') 
const indexPath = path.join( projectPath, 'index.html') 
const componentsPath = path.join(__dirname, 'components') 
const assetsPath = path.join(__dirname, 'assets') 
const assetsCopyPath = path.join( projectPath, 'assets') 
const stylesPath = path.join(__dirname, 'styles') 
const bundlePath = path.join(__dirname, 'project-dist', 'style.css') 

fs.mkdir( projectPath, { recursive: true }, (err) => {
  if (err) throw err 
}) 


async function copyDir(fileSource, fileCopy) {
  try {
    await fs.promises.rm(fileCopy, { recursive: true, force: true }) 
    await fs.promises.mkdir(fileCopy, { recursive: true }) 
    const files = await fs.promises.readdir(fileSource, {
      withFileTypes: true,
    }) 
    files.forEach((file) => {
      const copy = path.join(fileCopy, file.name) 
      const copyTo = path.join(fileSource, file.name) 
      if (file.isDirectory()) {
        copyDir(copyTo, copy) 
      } else {
        fs.promises.copyFile(copyTo, copy) 
      }
    }) 
  } catch (err) {
    console.log(err) 
  }
}
copyDir(assetsPath, assetsCopyPath) 


async function html() {
  let html = await fs.promises.readFile(pathToTemplate, 'utf-8', (err) => {
    if (err) throw err 
  }) 
  const files = await fs.promises.readdir(
    componentsPath,
    {
      withFileTypes: true,
    },
    (err) => {
      if (err) throw err 
    }
  ) 
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const data = await fs.promises.readFile(
        path.join(componentsPath, file.name),
        'utf-8',
        (err) => {
          if (err) throw err 
        }
      ) 
      const nameSection = `{{${path.parse(file.name).name}}}` 
      html = html.replace(nameSection, data) 
      await fs.promises.writeFile(indexPath, html, (err) => {
        if (err) throw err 
      }) 
    }
  }
}
html() 





fs.createWriteStream(bundlePath) 
fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err 
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(
        path.join(stylesPath, file.name)
      ) 
      readableStream.on('data', (data) => {
        fs.appendFile(bundlePath, data, (err) => {
          if (err) throw err 
        }) 
      }) 
    }
  }) 
}) 
