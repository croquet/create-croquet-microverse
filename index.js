#!/usr/bin/env node

function main() {
    let { execSync } = require("child_process");
    let fs = require("fs");
    let path = require("path");

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

    // you change the line below to "@croquet/microverse-library": "file:../microverse/dist" to test things locally
    return new Promise((resolve, reject) => {
        fs.writeFile("./package.json",
`{
  "name": "my-croquet-microverse-world",
  "version": "1.0.0",
  "description": "A World in Croquet Microverse",
  "scripts": {
    "start": "npm-run-all --parallel file-server watch-server",
    "file-server": "file-server --port 9684",
    "watch-server": "watch-server"
  },
  "dependencies": {
    "@croquet/microverse-library": "0.7.4"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5",
    "@croquet/microverse-watch-server": "^1.0.7",
    "@croquet/microverse-file-server": "^1.0.7",
    "@types/three": "0.155.0"
  }
}
`, {encoding: "utf8",
            flag: "w",
            mode: 0o644
           }, (err) => {
               if (err) {
                   console.log(err);
                   return reject();
               }
               resolve();
           });
    }).then(() => {
        return Promise.resolve(true);
    }).then(() => {
        return execAndLog("npm install");
    });
}

if (require.main === module) {
    main();
}
