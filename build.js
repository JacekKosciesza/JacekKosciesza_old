let packageJson = require('./package.json');
let chalk = require('chalk');
let copy = require('copy');
let fs = require('fs');
let watch = require('watch');
let hashmark = require('hashmark');
let glob = require('glob');

let info = chalk.blue;
let error = chalk.bold.red;

console.log(info(`Building ${packageJson.name} v${packageJson.version}\n`));

class Build {
    constructor() {
        this.config = [
            { glob: './src/scripts/*.js', tasks: [ this.copy ] }
        ]
    }

    run() {
        for (let entry of this.config) {
            console.log(info(entry.glob));
            glob(entry.glob, (error, files) => {
                console.log(files);
            });
        }
    }

    copy() {
        console.log(info(`copy`));
        copy('src/*.txt', '.tmp', function (err, files) {
            if (err) throw err;
            // `files` is an array of the files that were copied
            console.log(files); 
        });
    }
}

let build = new Build();
build.run();
