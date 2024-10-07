# test

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

Please use `ci` instead of `install`. This command installs the exact package version, the other one installs with updates if possible, so something can be broken.

```bash
$ npm ci
```

### Development

```bash
$ npm run dev
```

## Create an installer

### 1. Build first!

Please, use cross platform command, please!!!!
If you don't build the out will not be changed!!!
When you run npm run dev it creates an out, but it isn't ready for production.

```bash
# Cross platform
$ npm run build 

# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
### 2. Use your installer

You can use whatever you want, but I recommend Electron Builder or Electron Forge.
Electron Forge allows to publish, Builder is a little bit easier.

And please **READ THE F* DOCUMENTATION** and **BUILD First!!!!**

Example of how to use [Electron Builder](https://www.electron.build/):

```bash
$ npm install electron-builder # install it

# After installing do this

$ npm run build # Really? What did I say?

$ npm run app:dist 
```

You'll find everything in `/dist`