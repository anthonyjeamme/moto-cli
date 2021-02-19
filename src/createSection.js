const fs = require('fs')
const chalk = require('chalk')

//
const generate = (modelFileName) => (name) =>
	fs
		.readFileSync(`${__dirname}\\..\\models\\${modelFileName}.txt`, 'utf-8')
		.replace(/#SECTIONNAME#/g, name)
		.replace(/#SECTIONDEFINITIONNAME#/g, lowerCaseFirstChar(name))
		.replace(
			/#SECTIONKEBABNAME#/g,
			CamelToKebabCase(lowerCaseFirstChar(name))
		)

const generateFiles = (root, name, list) =>
	list.map(([ext, generator]) => {
		fs.writeFileSync(`${root}/${name}.${ext}`, generator(name))
	})

const uperCaseFirstChar = (string) =>
	`${string.substr(0, 1).toUpperCase()}${string.substr(1)}`

const lowerCaseFirstChar = (string) =>
	`${string.substr(0, 1).toLowerCase()}${string.substr(1)}`

const CamelToKebabCase = (string) =>
	string.replace(/([A-Z])/g, '-$1').toLowerCase()

// Generators from models (files in ../models).
const generateTSX = generate('SectionTSX')
const generateSCSS = generate('SectionSCSS')
const generateTypes = generate('SectionTypes')
const generateParams = generate('SectionParams')
const generateDefaultData = generate('SectionDefaultData')
const generateDefinition = generate('SectionDefinition')

const getConfig = () => {
	return JSON.parse(fs.readFileSync('./moto.json'))
}

const createSection = (_name) => {
	const name = uperCaseFirstChar(_name)

	const { path } = getConfig().section

	const root = `${path}/${name}`

	if (fs.existsSync(root)) {
		console.log(
			`Section ${chalk.green(name)} ${chalk.red('already exists')}`
		)
		process.exit(-1)
	}

	fs.mkdirSync(root)

	generateFiles(root, name, [
		['tsx', generateTSX],
		['scss', generateSCSS],
		['types.ts', generateTypes],
		['params.tsx', generateParams],
		['defaultData.tsx', generateDefaultData],
		['definition.ts', generateDefinition]
	])

	addSectionToList(name)

	console.log(`✔️  Section ${chalk.green(name)} created`)
	console.log(
		`You can now import ${chalk.blue(
			`${root}/${name}.section.ts`
		)} in your pages.`
	)
}

module.exports = createSection

const addSectionToList = (name) => {
	const { list } = getConfig()

	const content = fs.readFileSync(list.path, 'utf-8')

	fs.writeFileSync(
		list.path,
		content
			.replace(
				'// DO NOT REMOVE THIS LINE.',
				`import ${lowerCaseFirstChar(
					name
				)} from '~sections/${name}/${name}.definition'\n// DO NOT REMOVE THIS LINE.`
			)
			.replace(
				'// DO NOT REMOVE THIS LINE NEITHER.',
				`,${lowerCaseFirstChar(
					name
				)}\n	// DO NOT REMOVE THIS LINE NEITHER.`
			),
		{ encoding: 'utf-8' }
	)
}
