/**
 * Installation
 */

const fs = require('fs');
const theCWD = process.cwd();
const theCWDArray = theCWD.split('/');
const theDir = theCWDArray[theCWDArray.length - 1];
const ora = require('ora');
const execa = require('execa');
const chalk = require('chalk');
const download = require('download');
const handleError = require('./handleError.js');
const clearConsole = require('./clearConsole.js');
const printNextSteps = require('./printNextSteps.js');

module.exports = () => {
	// Init.
	clearConsole();

	// Files.
	const filesToDownload = [
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/.babelrc',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/.gitignore',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/.stylelintrc',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/LICENSE',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/README.md',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/gulpfile.js',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/installer/package.json',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/server.js',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/index.html',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/etc/manifest.json',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/includes/content.html',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/includes/footer.html',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/includes/header.html',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/includes/helmet.html',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/css/globals.css',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/css/gopablo.css',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/css/mixins.css',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/css/styles.css',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/css/variables.css',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/img/favicon.ico',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/img/icon-192.png',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/img/icon-512.png',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/img/logo.svg',

		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/js/main.js',
		'https://raw.githubusercontent.com/luangjokaj/gopablo/v0.1.3-6/src/assets/js/onclick.js',
	];

	// Organise file structure
	const dotFiles = ['.babelrc', '.gitignore', '.stylelintrc'];
	const srcFiles = ['index.html'];
	const etcFiles = ['manifest.json'];
	const includesFiles = ['content.html', 'footer.html', 'header.html', 'helmet.html'];
	const cssFiles = ['globals.css', 'gopablo.css', 'mixins.css', 'styles.css', 'variables.css'];
	const imgFiles = ['favicon.ico', 'icon-192.png', 'icon-512.png', 'logo.svg'];
	const jsFiles = ['main.js', 'onclick.js'];

	// Start.
	console.log('\n');
	console.log(
		'📦 ',
		chalk.black.bgYellow(` Downloading 🐺 GoPablo files in: → ${chalk.bgGreen(` ${theDir} `)}\n`),
		chalk.dim(`\n In the directory: ${theCWD}\n`),
		chalk.dim('This might take a couple of minutes.\n'),
	);

	const spinner = ora({ text: '' });
	spinner.start(`1. Creating 🐺 GoPablo files inside → ${chalk.black.bgWhite(` ${theDir} `)}`);

	// Download.
	Promise.all(filesToDownload.map(x => download(x, `${theCWD}`))).then(async () => {
		if (!fs.existsSync('src')) {
			await execa('mkdir', [
				'src',
				'src/etc',
				'src/includes',
				'src/assets',
				'src/assets/css',
				'src/assets/img',
				'src/assets/js',
			]);
		}

		dotFiles.map(x =>
			fs.rename(`${theCWD}/${x.slice(1)}`, `${theCWD}/${x}`, err => handleError(err)),
		);
		srcFiles.map(x => fs.rename(`${theCWD}/${x}`, `${theCWD}/src/${x}`, err => handleError(err)));
		etcFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/etc/${x}`, err => handleError(err)),
		);
		includesFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/includes/${x}`, err => handleError(err)),
		);
		cssFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/css/${x}`, err => handleError(err)),
		);
		imgFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/img/${x}`, err => handleError(err)),
		);
		jsFiles.map(x =>
			fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/js/${x}`, err => handleError(err)),
		);
		spinner.succeed();

		// The npm install.
		spinner.start('2. Installing npm packages...');
		// await execa('npm', ['install', '--silent']);
		await execa('npm', ['install']);
		spinner.succeed();

		// Done.
		printNextSteps();
	});
};
