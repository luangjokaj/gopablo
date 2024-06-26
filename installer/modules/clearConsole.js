/**
 * Cross platform clear console.
 *
 * Support for win32 and others.
 */

const clearConsole = () => {
	process.stdout.write(
		'win32' === process.platform ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
	);
};

export { clearConsole };
