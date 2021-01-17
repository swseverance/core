const fs = require("fs");
const path = require("path");
const ncp = require('ncp').ncp;

const makeDir = (location) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(location, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

const copyDirectory = (entryPoint, outputLocation) => {
    return new Promise((resolve, reject) => {
        ncp(entryPoint, outputLocation, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

const build = async () => {
    const outDir = path.join(__dirname, "/dist/");
    await Promise.all([
        copyDirectory(path.join(__dirname, "/common/"), path.join(outDir, "/common")),
        copyDirectory(path.join(__dirname, "/workspaces/"), path.join(outDir, "/workspaces"))
    ])
};

build().then(() => console.log("Build complete!")).catch(console.error);