/**
 * Installation
 */

import fs from 'fs';
import ora from 'ora';
import execa from 'execa';
import chalk from 'chalk';
import download from 'download';
import { createRequire } from 'module';
import { handleError } from './handleError.js';
import { clearConsole } from './clearConsole.js';
import { printNextSteps } from './printNextSteps.js';

const require = createRequire(import.meta.url);
const packageData = require('../package.json');

const version = packageData.version;

const theCWD = process.cwd();
const theCWDArray = theCWD.split('/');
const theDir = theCWDArray[theCWDArray.length - 1];

const run = () => {
	// Init
	clearConsole();

	let upstreamUrl = `https://raw.githubusercontent.com/luangjokaj/gopablo/v${version}`;

	// Files
	const filesToDownload = [
		`${upstreamUrl}/.babelrc`,
		`${upstreamUrl}/.gitignore`,
		`${upstreamUrl}/.stylelintrc`,
		`${upstreamUrl}/.editorconfig`,
		`${upstreamUrl}/LICENSE`,
		`${upstreamUrl}/README.md`,
		`${upstreamUrl}/gulpfile.js`,
		`${upstreamUrl}/installer/package.json`,
		`${upstreamUrl}/server.js`,

		`${upstreamUrl}/src/index.html`,

		`${upstreamUrl}/src/etc/htaccess.txt`,
		`${upstreamUrl}/src/etc/manifest.json`,
		`${upstreamUrl}/src/etc/robots.txt`,

		`${upstreamUrl}/src/includes/content.html`,
		`${upstreamUrl}/src/includes/footer.html`,
		`${upstreamUrl}/src/includes/header.html`,
		`${upstreamUrl}/src/includes/helmet.html`,

		`${upstreamUrl}/src/assets/css/gopablo.css`,
		`${upstreamUrl}/src/assets/css/styles.css`,

		`${upstreamUrl}/src/assets/img/favicon.ico`,
		`${upstreamUrl}/src/assets/img/logo.svg`,

		`${upstreamUrl}/src/assets/js/main.js`,
		`${upstreamUrl}/src/assets/js/onclick.js`,
	];

	// Organise file structure
	const dotFiles = ['.babelrc', '.gitignore', '.stylelintrc', '.editorconfig'];
	const srcFiles = ['index.html'];
	const etcFiles = ['htaccess.txt', 'manifest.json', 'robots.txt'];
	const includesFiles = [
		'content.html',
		'footer.html',
		'header.html',
		'helmet.html',
	];
	const cssFiles = ['gopablo.css', 'styles.css'];
	const imgFiles = ['favicon.ico', 'logo.svg'];
	const jsFiles = ['main.js', 'onclick.js'];

	// Start
	console.log('\n');
	console.log(
		'📦 ',
		chalk.black.bgYellow(
			` Downloading 🐺 GoPablo files in: → ${chalk.bgGreen(` ${theDir} `)}\n`
		),
		chalk.dim(`\n In the directory: ${theCWD}\n`),
		chalk.dim('This might take a couple of minutes.\n')
	);

	const spinner = ora({ text: '' });
	spinner.start(
		`1. Creating 🐺 GoPablo files inside → ${chalk.black.bgWhite(` ${theDir} `)}`
	);

	// Download
	Promise.all(filesToDownload.map((x) => download(x, `${theCWD}`))).then(
		async () => {
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

			dotFiles.map((x) =>
				fs.rename(`${theCWD}/${x.slice(1)}`, `${theCWD}/${x}`, (err) =>
					handleError(err)
				)
			);
			srcFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/${x}`, (err) => handleError(err))
			);
			etcFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/etc/${x}`, (err) =>
					handleError(err)
				)
			);
			includesFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/includes/${x}`, (err) =>
					handleError(err)
				)
			);
			cssFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/css/${x}`, (err) =>
					handleError(err)
				)
			);
			imgFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/img/${x}`, (err) =>
					handleError(err)
				)
			);
			jsFiles.map((x) =>
				fs.rename(`${theCWD}/${x}`, `${theCWD}/src/assets/js/${x}`, (err) =>
					handleError(err)
				)
			);
			spinner.succeed();

			// The npm install
			spinner.start('2. Installing npm packages...');
			await execa('npm', ['install']);
			spinner.succeed();

			// Done
			printNextSteps();
		}
	);
};

export { run };
