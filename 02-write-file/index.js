const process = require('process')
const fs = require('fs')
const path = require('path')
const { stdin, stdout } = process
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'))

stdout.write('Write something (CTRL+C to exit)\n')
stdin.on('data', data => {
  if (data.toString() == 'exit\n'){
    process.exit()
  }
  output.write(data)
})
process.on('SIGINT',()=> process.exit())
process.on('exit', () => {
  console.log('Bye')
})