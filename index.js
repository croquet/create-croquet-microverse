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

    function copyFileSync(source, target) {
        let targetFile = target;

        // If target is a directory, a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
        }

        fs.writeFileSync(targetFile, fs.readFileSync(source));
    }

    function copyFolderRecursiveSync(source, target) {
        let files = [];

        // Check if folder needs to be created or integrated
        let targetFolder = path.join(target, path.basename(source));
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }

        // Copy
        if (fs.lstatSync(source).isDirectory()) {
            files = fs.readdirSync(source);
            files.forEach((file) => {
                let curSource = path.join(source, file);
                if (fs.lstatSync(curSource).isDirectory()) {
                    copyFolderRecursiveSync(curSource, targetFolder);
                } else {
                    copyFileSync(curSource, targetFolder);
                }
            });
        }
    }

    function copyFiles() {
        copyFolderRecursiveSync("node_modules/@croquet/microverse-library/behaviors", ".");
        copyFolderRecursiveSync("node_modules/@croquet/microverse-library/assets", ".");
        copyFolderRecursiveSync("node_modules/@croquet/microverse-library/worlds", ".");
        copyFolderRecursiveSync("node_modules/@croquet/microverse-library/meta", ".");
        copyFileSync("node_modules/@croquet/microverse-library/index.html", "./index.html");
    }

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
    "@croquet/microverse-library": "0.1.10"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5",
    "@croquet/microverse-watch-server": "^1.0.6",
    "@croquet/microverse-file-server": "^1.0.4"
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
        /*
          new Promise((resolve, reject) => {
            fs.writeFile("./apiKey.js", `
const apiKey = "paste your apiKey from croquet.io/keys";
const appId = "type your own appId such as com.example.david.mymicroverse";
export default {apiKey, appId};

// you may export other Croquet session parameters to override default values.
`.trim(), {encoding: "utf8",
           flag: "w",
           mode: 0o644
          }, (err) => {
              if (err) {
                  console.log(err);
                  return reject();
              }
              resolve();
          });
        });
        */
    }).then(() => {
        return execAndLog("npm install");
    }).then(() => {
        copyFiles();
    });
}

if (require.main === module) {
    main();
}
