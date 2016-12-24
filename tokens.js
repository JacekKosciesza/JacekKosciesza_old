var pjson = require('./package.json');
var fs = require('fs')

let replacements = new Map([
    ['YEAR', new Date().getFullYear()],
    ['VERSION', pjson.version]
]);

let filenames = process.argv.slice(2);

filenames.forEach(filename => {
    replaceTokens(filename, replacements);
});

function replaceTokens(filename, replacements) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        let result = data;
        for (let [token, replacement] of replacements) {
            console.log(token);
            result = result.replace(`{{${token}}}`, replacement);
        }

        fs.writeFile(filename, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}