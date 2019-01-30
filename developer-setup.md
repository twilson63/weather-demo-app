# Svelte Developer Setup

Getting a svelte app up and running is good, but we need to create a solid developer experience so that we don't have to rebuild or refresh the server everytime we make some changes.

> There is a tradeoff to developer experiences, if you want hot-module reloading and all of the complexity that comes with that implemenation, I recommend you look at webpack, but if you want something a little lighter that works well, try this approach:

```
yarn add --dev npm-run-all
```

```
npx json -I -f package.json -e 'this.scripts.autoload = "rollup -cw"'
npx json -I -f package.json -e 'this.scripts["start:dev"] = "npx browser-sync start --server 'public' --files 'public' --single"'
npx json -I -f package.json -e 'this.scripts.dev = "run-p start:dev autoload"'
```

```
yarn dev
```

This setup will run the app on port 3000 and will watch for changes, so if you change the App.html file, it will rebuild your app and update the browser with the new changes. This is called browser-sync. It is a solid solution to keep your changes up to date and create a solid feedback loop dev environment, the tradeoff is not having to install a ton of code to implement this dev setup.


