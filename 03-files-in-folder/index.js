const path = require('path') 
const fs = require('fs') 
const folderPath = path.join(__dirname, 'secret-folder') 

fs.readdir(folderPath, { withFileTypes: true }, (err, el) => {
  el.forEach((file) => {
      const filePath = path.join(folderPath, file.name) 
      const File = path.parse(filePath) 
      fs.stat(filePath, (err, stats) => {
        if (err) throw err 
        console.log(
          `${File.name} - ${File.ext.slice(1)} - ${stats.size/1024} kb`
        ) 
      }) 
    
  }) 
}) 


