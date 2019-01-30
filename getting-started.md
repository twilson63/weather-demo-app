# Svelte v3

## Getting Started

> Svelte - attractively thin; gracefully slender;

The Svelte framework gives you a modern developer experience and compiles your code down to a slim and thin performant bundle.

This document is to record the steps to get started using svelte, there are several templates that can provide great working defaults, but I wanted to record a step by step process to get started with svelte using `rollup` as the build tool.

Svelte compiles your development code into vanillaJS, so we have to setup a compilier step.

```
mkdir weather-app
cd weather-app
yarn init -y
yarn add --dev svelte@alpha rollup 
```

You will notice we are adding svelte and rollup as devDependencies.

```
yarn add --dev rollup-plugin-svelte
```

Create a public directory and add an html file and a global.css file

```
mkdir public
```

public/index.html

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <title>Svelte App</title>

    <link rel="stylesheet" href="global.css" />
    <link rel="stylesheet" href="bundle.css" />
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```

public/global.css

```
html, body {
	position: relative;
	width: 100%;
	height: 100%;
}

body {
	color: #333;
	margin: 0;
	padding: 8px;
	box-sizing: border-box;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

a {
	color: rgb(0,100,200);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

a:visited {
	color: rgb(0,80,160);
}

label {
	display: block;
}

input, button, select, textarea {
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-radius: 2px;
}

input:disabled {
	color: #ccc;
}

input[type="range"] {
	height: 0;
}

button {
	background-color: #f4f4f4;
	outline: none;
}

button:active {
	background-color: #ddd;
}

button:focus {
	border-color: #666;
}
```

Create a `src` folder and a `main.js` file

```
mkdir src
```

src/main.js

``` js
import App from './App.html'

new App({ target: document.body })
```

And lets create a first svelte component

src/App.html

``` html
<h1>Hello World</h1>
```

Now, that we have the basics of our web app, we need to use rollup to build the application, we do this by creating a config file.

rollup.config.js

```
import svelte from 'rollup-plugin-svelte'

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    file: 'public/bundle.js'
  },
  plugins: [
    svelte({ css: css => css.write('public/bundle.css')})
  ]
}
```

Add the build step to our package.json

> this uses a cli called `json` that will edit the package json file and add the build step to the scripts property.

``` 
json -I -f package.json -e 'this.scripts = {"build": "rollup -c"}'
```


Build our app:

```
yarn build
```

You should be able to open the index.html file in the browser and see `Hello World`

```
open public/index.html
```


There are a couple of other plugins we need to add to make all of sveltes functionality work:

```
yarn add --dev rollup-plugin-node-resolve
yarn add --dev rollup-pluing-commonjs
```

These plugins handle the node modules resolutions and commonjs import files.

Here is what our new `rollup.config.js` should look like

```
import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
    file: 'public/bundle.js'
  },
  plugins: [
    svelte({
      css: css => css.write('public/bundle.css')
    }),
    resolve(),
    commonjs()
  ]
}
```


