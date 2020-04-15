var crypto = require('crypto'),
  chalk = require('chalk'),
  fs = require('fs'),
  path = require('path'),
  tar = require('tar'),
  streamBuffers = require('stream-buffers');

var HEADER_SIZE = 512;
var challengePrivateKey = Buffer.from(
  fs.readFileSync(__dirname + '/../keyring/challenge.key')
);

console.log(
  chalk.blue('Reading'),
  chalk.yellow(process.argv[2]),
  chalk.blue('into memory')
);

var tarFile = fs.readFileSync(process.argv[2]);

console.log(chalk.bold.green('Done!'));

var globalChallengeDirectory = __dirname + '/../challenges/';
var challengeSlug = process.argv[2].split('/').slice(-1)[0].split('.')[0];
var challengeDirectory = globalChallengeDirectory + challengeSlug;

console.log(chalk.blue('Fetching keys from tarball'));

var header = tarFile.subarray(0, HEADER_SIZE);
var encryptedContent = tarFile.subarray(HEADER_SIZE);

var keyPair = crypto.privateDecrypt(challengePrivateKey, header);
var aesKey = keyPair.subarray(0, 32);
var iv = keyPair.subarray(32);
var decryptor = crypto.createDecipheriv('aes-256-ctr', aesKey, iv);

console.log(chalk.bold.green('Done!'));
console.log(chalk.blue('Decrypting tarball'));

var tarBall = decryptor.update(encryptedContent);
var mystr = new streamBuffers.ReadableStreamBuffer({
  frequency: 1,
  chunkSize: 1024 * 8, //8KiB
});
fs.mkdirSync(challengeDirectory, { recursive: true });
mystr.push(tarBall);
mystr.pipe(
  tar.x({
    cwd: challengeDirectory,
    sync: true,
  })
);

console.log(chalk.bold.green('Done!'));
console.log(chalk.blue('Writing Index'));

var indexContent = JSON.parse(
  fs.readFileSync(globalChallengeDirectory + '/index.json')
);

var date = Date.parse(new Date().toDateString());
var dateString = date.toString();

indexContent[dateString] = challengeSlug;
fs.writeFileSync(
  globalChallengeDirectory + '/index.json',
  JSON.stringify(indexContent, undefined, 4)
);
console.log(chalk.bold.green('Done!'));
console.log(chalk.blue('Removing tarball'));
fs.unlinkSync(process.argv[2]);
console.log(chalk.bold.green('Done!'));
