# [![GoPablo](https://raw.githubusercontent.com/luangjokaj/gopablo/master/src/assets/img/logo.svg?sanitize=true)](https://www.gopablo.co/)

[![Version](https://img.shields.io/github/package-json/v/luangjokaj/gopablo)](https://www.gopablo.co/) [![Dependencies](https://img.shields.io/david/luangjokaj/gopablo)](https://www.gopablo.co/)

[GoPablo](https://www.gopablo.co/) a static site generator.

- [Introduction](#introduction)
	- [Features](#features)
- [1. Installing Node.js](#1-installing-nodejs)
- [2. Set Up Project](#2-set-up-project)
	- [Install GoPablo from NPM](#install-gopablo-from-npm)
	- [Install GoPablo from Repository](#install-gopablo-from-repository)
- [3. CSS, PostCSS and Sass](#3-css-postcss-and-sass)
	- [PostCSS](#postcss)
	- [Sass](#sass)
- [4. Images and Fonts](#4-images-and-fonts)
	- [Images](#images)
	- [Fonts](#fonts)
- [5. JavaScript ES6](#5-javascript-es6)
	- [Write ES6 JavaScript](#write-es6-javascript)
- [6. External Libraries](#6-external-libraries)
- [7. Code Style Rules](#7-code-style-rules)
- [8. Deploy](#8-deploy)
	- [Heroku](#heroku)
	- [Automated Netlify deployments](#automated-netlify-deployments)
- [9. Audit and Page Speed](#9-audit-and-page-speed)

## TL;DR
### Initialize GoPablo
```
npx gopablo
```

### Run development mode
Build and open your browser to http://localhost:3000.
```
npm run dev
```

### Build distribution files for production
```
npm run prod
```
Ready to deploy 🚀

---

## Introduction
| Information | Discord | Donate |
|:------------|:---------|:-------|
| [GoPablo](https://www.gopablo.co) is a static site generator with a modern development workflow, integrated web server, auto-reload, CSS preprocessors, and ES6 ready.| [![Discord server](https://svgshare.com/i/Lqc.svg)](https://discord.gg/uQFdMddMZw) | [![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/guidelines/logo-mark-1.svg)](https://www.buymeacoffee.com/luangjokaj) |

## Features
|👇|Includes|
|:-:|:---|
|📦| Live Server|
|🔥| Hot Reload & CSS Injection|
|⚙| Babel 7|
|🤖| Express Server|
|🎒| Code Minification|
|🌈| Image Compression|
|🕸| Templating & Partial HTML Injection|
|🎨| PostCSS & Next Generation CSS|
|💨| Tailwind CSS|
|✂️| Cache-Busting|
|🛎| Distribution Files|

# 1. Installing Node.js
GoPablo requires **Node.js v12+**. This is the only global dependency. You can download Node.js **[here](https://nodejs.org/)**.

Node.js is a JavaScript runtime built on Chrome’s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js’ package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

# 2. Set Up Project
### File Structure
```
    ├── build/                   # Build files
    ├── dist/                    # Distribution files
    ├── src/                     # Source files
    │   ├── assets/              # Assets directory
    │       ├── css/             # CSS files
    │       ├── fonts/           # Fonts directory
    │       ├── img/             # Image directory
    │       ├── js/              # JavaScript files
    │   ├── etc/                 # Extra files
    │   ├── includes/            # HTML template partials
    │   ├── index.html           # Index page
    └── .babelrc                 # Babel configuration
    └── .gitignore               # Git ignored files
    └── .stylelintrc             # Stylelint configuration file
    └── gulpfile.js              # Gulp configuration
    └── LICENSE                  # License agreements
    └── package-lock.json        # Packages lock file
    └── package.json             # Node.js packages
    └── README.md                # You are reading this
    └── server.js                # Express server
```

## Install GoPablo from NPM
To install GoPablo create a directory for the new website and from there run the command to generate the file structure:
```
npx gopablo

```
That's it 🍾 easy as that. Now start the development workflow: [Start Workflow](#start-workflow)

## Install GoPablo from Repository
To install GoPablo you need to clone the repository from GitHub:
```
git clone https://github.com/luangjokaj/gopablo
```

- This will clone the repository on your local machine. Navigate to the newly created directory.

- Replace the file: `./package.json` with `./installer/package.json` and continue with the dependency installation.

**INSTALL DEPENDENCIES**

```
npm install
```

## Start Workflow

- To start the development server run the command:
```
npm run dev
```
- You are ready to go! Happy coding! 🤓

## Generate production files
To generate your distribution files run the command:
```
npm run prod
```
The files will be generated in the `dist/` directory.

## Templating and HTML Partials
To avoid repetitive HTML code, GoPablo uses [gulp-file-include](https://github.com/haoxins/gulp-file-include). It has a simple templating synthax and allows to re-use chunks of code written in separate files. These partials are located in the directory:
```
src/includes/
```
For more information check out their documentation and examples: https://github.com/haoxins/gulp-file-include 

## New pages
To create new pages, simply create new .html files in the `src/` directory.

# 3. CSS, PostCSS and Sass
## PostCSS
By default GoPablo supports [PostCSS](http://postcss.org/), a similar preprocessor to Sass, Less and others but with more functionality. On top of that PostCSS is 3x faster than Sass and 4x faster than Less. Features come in the shape of PostCSS plugins. Think of these like using Lego, where each piece is a different feature that can transform your CSS in some way. PostCSS lets you stick these pieces together so that you can build up your own feature set, adding and removing plugins as and when you need them. [postcss-preset-env](https://preset-env.cssdb.org//) is installed by default. Read more about PostCSS [here](https://ashleynolan.co.uk/blog/postcss-a-review).

**POSTCSS PLUGINS**

GoPablo has two different sets of PostCSS plugins - one for the development environment (pluginsListDev) and one for the production task (pluginsListProd).
```javascript
//--------------------------------------------------------------------------------------------------
/* -------------------------------------------------------------------------------------------------
PostCSS Plugins
 ------------------------------------------------------------------------------------------------- */
const pluginsDev = [
	postcssImport,
	postCSSMixins,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
];
const pluginsProd = [
	postcssImport,
	postCSSMixins,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
	require('cssnano')({
		preset: [
			'default',
			{
				discardComments: true,
			},
		],
	}),
];
//--------------------------------------------------------------------------------------------------
```

**WRITING CSS**

The starting point for CSS is the file:
```
src/assets/css/styles.css
```

**TAILWIND CSS**

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center` and `rotate-90` that can be composed to build any design, directly in your markup. Tailwind comes pre-installed with GoPablo.

## Sass
GoPablo is super flexible. You can install Sass and use it as the main CSS preprocessor:
```
npm install gulp-sass --save-dev
````

Include Sass in gulpfile.js:
```javascript
const sass = require('gulp-sass');
````

Change the gulp tasks stylesDev to:
```javascript
function stylesDev() {
	return src('./src/assets/css/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({includePaths: 'node_modules'}).on('error', sass.logError))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build/assets/css'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
}
```

Also the watch task has to be changed in order to watch for .scss filetypes:
```javascript
watch('./src/assets/css/**/*.scss', stylesDev);
```

Change the gulp tasks styleProd to:
```javascript
function stylesProd() {
	return src('./src/assets/css/styles.scss')
		.pipe(sass({includePaths: 'node_modules'}).on('error', sass.logError))
		.pipe(dest('./dist/assets/css'))
}
```

# 4. Images and Fonts
## Images
It is recommended to store image assets in the directory:
```
src/assets/img/
```

In the production build SVGs and other image assets will go through a **minification** process.

## Fonts
Fonts are always special. Your fonts should be stored in:

```
src/assets/fonts/
```

Then you can include them in your **CSS**:
```css
@font-face {
	font-family: 'Helvetica Neue Thin';
	src: url('./fonts/Helvetica-Neue-Thin.eot');
	src: url('./fonts/Helvetica-Neue-Thin.eot') format('eot'),
	url('./fonts/Helvetica-Neue-Thin.woff2') format('woff2'),
	url('./fonts/Helvetica-Neue-Thin.woff') format('woff'),
	url('./fonts/Helvetica-Neue-Thin.ttf') format('truetype'),
	url('./fonts/Helvetica-Neue-Thin.svg') format('svg');
}
```

# 5. JavaScript ES6
GoPablo supports ES6 JavaScript with [Babel](https://babeljs.io/). Babel has support for the latest version of JavaScript through syntax transformers. These plugins allow you to use new syntax, right now without waiting for browser support.

## Write ES6 JavaScript
Your JavaScript code should be located in:
```
src/assets/js/
```

GoPablo will watch for changes under the js directory and bundle the code in a single file, which will be included in the footer of the page as:
```
footer-bundle.js
```

Check the gulp configuration to learn more about how JavaScript is generated.

# 6. External Libraries
Including external JavaScript libraries is as simple as installing the npm script and including it in the **gulpfile.js**
```javascript
/* -------------------------------------------------------------------------------------------------
Header & Footer JavaScript Boundles
-------------------------------------------------------------------------------------------------- */
const headerJS = [
	'./node_modules/jquery/dist/jquery.js',
	'./node_modules/nprogress/nprogress.js',
	'./node_modules/aos/dist/aos.js',
	'./node_modules/isotope-layout/dist/isotope.pkgd.js'
];
const footerJS = [
	'./src/assets/js/**'
];
//--------------------------------------------------------------------------------------------------
```

You can include the scripts in the head of the page before the DOM is loaded by placing them in the **headerJS** array or in the footer of the page after the DOM is loaded in the **footerJS** array. Only footer scripts are processed with Babel thus supporting ES6, however you can change this in the configuration if you want to run both header and footer scripts with Babel.

A build restart is required for changes to take effect.

# 7. Code Style Rules
GoPablo comes with its own set of code style rules:
```
.stylelintrc
```

## Lint CSS
Before pushing changes make sure you have clean and consistent CSS. Run [stylelint](https://stylelint.io/) with the command:
```
npm run lint
```

# 8. Deploy
There are a lot of possiblities and different ways to deploy your static website. The most traditional one being: generating your distribution files and uploading them manually, usually FTP.

## Heroku
With the help of a simple Express server, with GoPablo we can deploy to heroku out of the box.

1. Create Heroku application: `heroku create`.
2. Push the branch to Heroku origins: `git push heroku master`

## Automated Netlify deployments
Netlify is a great service that can be used to deploy generated websites. All you have to do is: 

1. Connect your GitHub repository.
2. Choose **Branch to deploy**, usually: `master`.
2. Set the **Build command** to: `npm run prod`.
3. Set the **Publish directory** to: `dist/`.

---

We are live 🌍

---

# 9. Audit and Page Speed
|![audit](https://i.imgur.com/8fHysOB.png)|![page-speed](https://i.imgur.com/QMQtKfp.png)|
|:-:|:---|

---
- [Changelog](CHANGELOG.md)
- License: [MIT](LICENSE)
- GoPablo [Website](https://www.gopablo.co/)
