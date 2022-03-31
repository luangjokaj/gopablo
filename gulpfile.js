/* -------------------------------------------------------------------------------------------------

GoPablo - Static site generator
Contributors: Luan Gjokaj, Sherif Saleh

-------------------------------------------------------------------------------------------------- */
import pkg from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import cssnano from 'cssnano';
import del from 'del';
import fileinclude from 'gulp-file-include';
import gutil from 'gulp-util';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import modRewrite from 'connect-modrewrite';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postCSSMixins from 'postcss-mixins';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import RevAll from 'gulp-rev-all';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import purgecss from 'gulp-purgecss';

const { gulp, series, parallel, dest, src, watch } = pkg;

//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
PostCSS Plugins
-------------------------------------------------------------------------------------------------- */
const pluginsListDev = [
	postcssImport,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-function': true,
			'custom-media-queries': true,
		},
	}),
	postCSSMixins,
	autoprefixer,
];
const pluginsListProd = [
	postcssImport,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-function': true,
			'custom-media-queries': true,
		},
	}),
	postCSSMixins,
	autoprefixer,
	cssnano(),
];

//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Header & Footer JavaScript Boundles
-------------------------------------------------------------------------------------------------- */
const headerJS = ['./node_modules/aos/dist/aos.js'];
const footerJS = ['./node_modules/jquery/dist/jquery.js', './src/assets/js/**'];

//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
Development Tasks
-------------------------------------------------------------------------------------------------- */
function devServer() {
	browserSync.init({
		logPrefix: '🐺 GoPablo',
		server: {
			baseDir: './build',
		},
		middleware: [modRewrite(['^.([^\\.]+)$ /$1.html [L]'])],
	});

	watch('./src/assets/css/**/*.css', stylesDev);
	watch('./src/assets/js/**', series(footerScriptsDev, Reload));
	watch('./src/assets/img/**', series(copyImagesDev, Reload));
	watch('./src/assets/fonts/**', series(copyFontsDev, Reload));
	watch('./src/includes/*.html', series(stylesDev, staticFilesDev, Reload));
	watch('./src/*.html', series(stylesDev, staticFilesDev, Reload));
}

function Reload(done) {
	browserSync.reload();
	done();
}

function copyImagesDev() {
	return src('./src/assets/img/**').pipe(dest('./build/assets/img'));
}

function copyFontsDev() {
	return src('./src/assets/fonts/**').pipe(dest('./build/assets/fonts'));
}

function stylesDev() {
	return src('./src/assets/css/styles.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(postcss(pluginsListDev))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build/assets/css'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
}

function headerScriptsDev() {
	return src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(concat('header-bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build/assets/js'));
}

function footerScriptsDev() {
	return src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(concat('footer-bundle.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build/assets/js'));
}

function staticFilesDev() {
	return src('./src/*.html')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileinclude({
				filters: {
					prefix: '@@',
					basepath: '@file',
				},
			})
		)
		.pipe(dest('./build'));
}

const dev = series(
	copyImagesDev,
	copyFontsDev,
	stylesDev,
	headerScriptsDev,
	footerScriptsDev,
	staticFilesDev,
	devServer
);
dev.displayName = 'dev';
export { dev };

/* -------------------------------------------------------------------------------------------------
Production Tasks
-------------------------------------------------------------------------------------------------- */
async function cleanProd() {
	await del(['./dist']);
}

function copyFontsProd() {
	return src('./src/assets/fonts/**').pipe(dest('./dist/assets/fonts'));
}

function headerScriptsProd() {
	return src(headerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('header-bundle.js'))
		.pipe(uglify())
		.pipe(dest('./dist/assets/js'));
}

function footerScriptsProd() {
	return src(footerJS)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(concat('footer-bundle.js'))
		.pipe(uglify())
		.pipe(dest('./dist/assets/js'));
}

function staticFilesProd() {
	return src('./src/*.html')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileinclude({
				filters: {
					prefix: '@@',
					basepath: '@file',
				},
			})
		)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[=|php]?[\s\S]*?\?>/],
			})
		)
		.pipe(dest('./dist'));
}

function copyImagesProd() {
	return src('./src/assets/img/**').pipe(dest('./dist/assets/img'));
}

function processImages() {
	return src(['./dist/assets/img/**'])
		.pipe(plumber({ errorHandler: onError }))
		.pipe(imagemin())
		.pipe(dest('./dist/assets/img'));
}

function stylesProd() {
	return src('./src/assets/css/styles.css')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(postcss(pluginsListProd))
		.pipe(
			purgecss({
				content: ['./src/**/*.html'],
				whitelist: ['aos-animate'],
				extractors: [
					{
						extractor: (content) => {
							return content.match(/[A-z0-9-:\/]+/g) || [];
						},
						extensions: ['css', 'html'],
					},
				],
			})
		)
		.pipe(dest('./dist/assets/css'));
}

function copyEtcProd() {
	return src('./src/etc/**').pipe(dest('./dist'));
}

function bustCaches() {
	return src(['./dist/**'])
		.pipe(
			RevAll.revision({
				dontRenameFile: ['.ico', '.html', '.txt', '.json'],
				dontUpdateReference: ['.ico', '.html', '.txt', '.json'],
			})
		)
		.pipe(dest('./dist'))
		.on('end', () => {
			gutil.beep();
			gutil.log(filesGenerated);
			gutil.log(thankYou);
		});
}

const prod = series(
	cleanProd,
	copyFontsProd,
	headerScriptsProd,
	footerScriptsProd,
	staticFilesProd,
	copyImagesProd,
	processImages,
	stylesProd,
	copyEtcProd,
	bustCaches
);
prod.displayName = 'prod';
export { prod };

/* -------------------------------------------------------------------------------------------------
Utility Tasks
-------------------------------------------------------------------------------------------------- */
const onError = (err) => {
	gutil.beep();
	gutil.log(staticBuild + ' - ' + errorMsg + ' ' + err.toString());
	this.emit('end');
};

/* -------------------------------------------------------------------------------------------------
Messages
-------------------------------------------------------------------------------------------------- */
const errorMsg = '\x1b[41mError\x1b[0m';
const filesGenerated =
	'Your production file are generated in: \x1b[1m' + '/dist/ ✅';

const staticBuild = '\x1b[42m\x1b[1m🐺 GoPablo\x1b[0m';
const staticBuildUrl = '\x1b[2m - https://www.gopablo.co/\x1b[0m';
const thankYou = 'Thank you for using ' + staticBuild + staticBuildUrl;

/* -------------------------------------------------------------------------------------------------
End of all Tasks
-------------------------------------------------------------------------------------------------- */
