const fs = require('fs');
const packageJSON = require('../package.json');

const version = packageJSON.version;
packageJSON.version = version.substring(0, version.length-1) + (parseInt(version[version.length-1])+1).toString();

console.log('Release version', packageJSON.version);

fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(packageJSON, null, 2));
