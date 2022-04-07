#!/usr/bin/env node

function main() {
    console.log("Hello from main");

    let { execSync } = require("child_process");
    let fs = require("fs");

    function execAndLog(...args) {
        try {
            const stdout = execSync(...args);
            console.log(stdout.toString());
        } catch (err) {
            if (err.stdout) console.log(err.stdout.toString());
            if (err.stderr) console.error(err.stderr.toString());
            throw err;
        }
    }
    
    return new Promise((resolve, reject) => {
        fs.writeFile(
            "./package.json", `
{
  "name": "my-crqouet-microverse-world",
  "version": "1.0.0",
  "description": "A World in Croquet Microverse",
  "scripts": {
    "start": "npm run file-server & npm run watch-server",
    "file-server": "npx file-server --builder",
    "watch-server": "npx watch-server"
  },
  "author": "Croquet Corporation",
  "license": "ISC",

  "dependencies": {
    "@croquet/microverse-builder": "file:/Users/ohshima/src/microverse/npm"
  },
  "devDependencies": {
    "@croquet/microverse-watch-server": "file:/Users/ohshima/src/microverse-watch-server",
    "@croquet/microverse-file-server": "file:/Users/ohshima/src/microverse-file-server"
  }
}`.trim(),
            {
                encoding: "utf8",
                flag: "w",
                mode: 0o644
            },
            (err) => {
                if (err) {
                    console.log(err);
                    return reject();
                }
                resolve();
            }
        )
    }).then(() => {
        execAndLog("npm install");
        execAndLog("cp -r node_modules/@croquet/microverse-builder/.gitignore node_modules/@croquet/microverse-builder/.eslintrc.js node_modules/@croquet/microverse-builder/* .");
    });
}

if (require.main === module) {
    main();
}
