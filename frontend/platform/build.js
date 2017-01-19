let packageJson = require('./package.json');
let chalk = require('chalk');
let copy = require('copy');
let fs = require('fs');
let watch = require('watch');
let hashmark = require('hashmark');
let glob = require('glob');
let chokidar = require('chokidar');
let multimatch = require('multimatch');

let info = chalk.blue;
let error = chalk.bold.red;

console.log(info(`Building ${packageJson.name} v${packageJson.version}\n`));

let config = [
    { glob: 'src/scripts/*.js', tasks: [ 'uglyfy',  'hashmark', 'copy' ] }
]
let options = { watch: false };

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
        chokidar.watch('src', {ignored: /(^|[\/\\])\../}).on('change', (path) => {
            for (let entry of this.config) {
                let files = multimatch([path.replace('/', '\\')], entry.glob)
                if (files && files.length) {
                    console.log(`${info(files)} -> ${chalk.green(entry.glob)}`);
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
}

process.argv.forEach((val, index, array) => {
  if (val === 'watch') {
      options.watch = true;
  }
});

let build = new Build(config, options);
build.run();


