const fs = require('fs') 
const path = require('path') 
const  Path = path.join(__dirname, 'files') 
const copyPath = path.join(__dirname, 'files-copy') 

async function copyDir(fileSource, fileCopy) {
  try {
    await fs.promises.rm(fileCopy, { recursive: true, force: true }) 
    await fs.promises.mkdir(fileCopy, { recursive: true }) 
    const files = await fs.promises.readdir(fileSource, { withFileTypes: true }) 
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

copyDir( Path, copyPath) 