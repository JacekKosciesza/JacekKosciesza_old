let packageJson = require('./package.json');
let chalk = require('chalk');
let copy = require('copy');
let fs = require('fs');
let watch = require('watch');
let hashmark = require('hashmark');
let glob = require('glob');
let chokidar = require('chokidar');
let multimatch = require('multimatch');
let crypto = require('crypto');
const md5File = require('md5-file/promise');
const path = require('path');

let info = chalk.blue;
let error = chalk.bold.red;

console.log(info(`Building ${packageJson.name} v${packageJson.version}\n`));

let config = [{
    glob: 'src/scripts/*.js',
    tasks: ['uglyfy', 'hashmark', 'copy']
}]
let options = {
    watch: false
};

class Build {
    constructor(config, options) {
        this.options = options;
        this.config = config;
    }

    run() {
        if (options.watch) {
            this.watch();
        } else {
            this.build();
        }
    }

    build() {
        for (let entry of this.config) {
            console.log(`${info(entry.glob)} -> ${chalk.green(entry.tasks)}`);
            glob(entry.glob, (error, files) => {
                console.log(files);
            });
        }
    }

    watch() {
        chokidar.watch('src', {
            ignored: /(^|[\/\\])\../
        }).on('change', (changedPath) => {
            for (let entry of this.config) {
                let files = multimatch([changedPath.replace('/', '\\')], entry.glob)
                if (files && files.length) {
                    for (let file of files) {
                        console.log(`${info(file)} -> ${chalk.green(entry.glob)}`);
                        this.md5sum(file, 8).then(md5sum => {
                            let parsedPath = path.parse(file)
                            let hashedFilename = `${parsedPath.dir.replace('src', 'build')}\\${parsedPath.name}.${md5sum}${parsedPath.ext}`
                            console.log(hashedFilename);
                            return hashedFilename;
                        }).then(hashedFilename => {
                            fs.createReadStream(file).pipe(fs.createWriteStream(hashedFilename));
                        });
                    }
                }
            }
        });
    }

    copy() {
        console.log(info(`copy`));
        copy('src/*.txt', '.tmp', (err, files) => {
            if (err) throw err;
            // `files` is an array of the files that were copied
            console.log(files);
        });
    }

    md5sum(filePath, length) {
        return md5File(filePath).then(hash => {
            return length ? hash.slice(0, length) : hash;
        })
    }
}

process.argv.forEach((val, index, array) => {
    if (val === 'watch') {
        options.watch = true;
    }
});

let build = new Build(config, options);
build.run();