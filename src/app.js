#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const createSection = require('./createSection')

const { usage } = require('./utils/usage')

const alias = require('./commands/alias/alias')

const requireMotoProject = () => {
	if (!fs.existsSync('./moto.json')) {
		console.log(
			`${chalk.red(
				'Not a moto projet'
			)}.\nPlease init with : ${chalk.green('moto init')}`
		)
		process.exit(-1)
	}
}

const commands = {
	alias,
	section: (args) => {
		switch (args[0]) {
			case 'create':
				requireMotoProject()

				if (args.length < 2) {
					usage()
					return
				}

				createSection(args[1])
				break

			default:
				usage()
				break
		}
	},
	init: () => {
		if (fs.existsSync('./moto.json')) {
			console.log('✔️  Already a moto project.')
		} else {
			fs.writeFileSync(
				'./moto.json',
				JSON.stringify(
					{
						section: { path: 'src/components/Sections' },
						list: { path: 'src/core/sections.ts' }
					},
					null,
					4
				)
			)
		}
	}
}

const app = () => {
	const args = process.argv.slice(2)

	if (!commands[args[0]]) {
		usage()
		return
	}

	commands[args[0]](args.slice(1))
}

app()
