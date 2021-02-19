const chalk = require('chalk')

const usage = () => {
	console.log(`How to use ${chalk.red('Moto')} :`)
	console.log(``)
	console.log(
		`moto alias add ${chalk.green('<name> <path>')}         ${chalk.grey(
			`// Add an alias to the project`
		)}`
	)

	console.log()
}

module.exports = {
	usage
}
