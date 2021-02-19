const chalk = require('chalk')

const fs = require('fs')

const { getJSONFileContent, saveJSONFileContent } = require('../../utils/misc')

const addAlias = (name, _path) => {
	const path = _path.replace(/^\.\//, '')

	if (!fs.existsSync(path)) {
		console.log(`folder ${path} do not exists`)
		return
	}

	if (fs.existsSync('./.eslintrc')) {
		const json = getJSONFileContent('./.eslintrc')
		if (!json.settings['import/resolver']) {
			json.settings['import/resolver'] = {}
		}
		if (!json.settings['import/resolver'].alias) {
			json.settings['import/resolver'].alias = []
		}
		if (json.settings['import/resolver'].alias.find(([a]) => a === name)) {
			console.log(chalk.red(`Alias ${name} already exists in .eslintrc`))
			return
		}
		json.settings['import/resolver'].alias.push([name, `./${path}`])
		saveJSONFileContent('./.eslintrc', json)
		console.log('Added to .eslintrc')
	}

	if (fs.existsSync('./jsconfig.json')) {
		const json = getJSONFileContent('./jsconfig.json')
		const jsconfigName = `${name}/*`
		if (!json.compilerOptions.paths) {
			json.compilerOptions.paths = {}
		}
		if (!!json.compilerOptions.paths[jsconfigName]) {
			console.log(
				chalk.red(`Alias ${name} already exists in jsconfig.json`)
			)
			return
		}
		json.compilerOptions.paths[jsconfigName] = [`${path}/*`]
		saveJSONFileContent('./jsconfig.json', json)
		console.log('Added to jsconfig.json')
	}

	if (fs.existsSync('./gatsby-config.js')) {
		let file = fs.readFileSync('./gatsby-config.js', 'utf-8')

		if (!file.includes(' // DO NOT REMOVE THIS COMMENT.')) {
			console.log(
				chalk.red(
					`Can't find " // DO NOT REMOVE THIS COMMENT.". Please add this comment in gatsby-config.js, in plugin gatsby-plugin-alias-imports options.alias, at the end.`
				)
			)
			return
		}

		file = file.replace(
			' // DO NOT REMOVE THIS COMMENT.',
			`,\n					'${name}': \`${'${__dirname}'}/${path}\` // DO NOT REMOVE THIS COMMENT.`
		)

		fs.writeFileSync('./gatsby-config.js', file, { encoding: 'utf-8' })
		console.log('Added to gatsby-config.js')
	}

	console.log(
		`Alias ${chalk.green('successfully')} added. Please restart gatsby.`
	)
}

const alias = (commands) => {
	if (commands.length !== 3) {
		console.log(chalk.red('Error on args.'))
		return
	}

	switch (commands[0]) {
		case 'add':
			return addAlias(...commands.slice(1))
	}

	console.log(commands)
}

module.exports = alias
