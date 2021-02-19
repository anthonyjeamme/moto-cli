const fs = require('fs')

const getJSONFileContent = (path) => {
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

const saveJSONFileContent = (path, json) => {
	fs.writeFileSync(path, JSON.stringify(json, null, 4), {
		encoding: 'utf-8'
	})
}

module.exports = {
	getJSONFileContent,
	saveJSONFileContent
}
