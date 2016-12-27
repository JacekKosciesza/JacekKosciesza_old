var pjson = require('./package.json');
var fs = require('fs')

let now = new Date();

let replacements = new Map([
    ['YEAR', now.getFullYear()],
    ['VERSION', pjson.version],
    ['YYYY/MM/DD', `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`]
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
            result = result.replace(new RegExp(`{{${token}}}`, 'g'), replacement);
        }

        fs.writeFile(filename, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}