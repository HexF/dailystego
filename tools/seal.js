var inquirer = require('inquirer'),
  crypto = require('crypto'),
  chalk = require('chalk'),
  fs = require('fs'),
  path = require('path'),
  tar = require('tar');

var challengesDir = __dirname + '/../challenges/backlog/';

var challengePublicKey = Buffer.from(
  fs.readFileSync(__dirname + '/../keyring/challenge.pub')
);

var decryptorCode =
  'if(!process.argv[2])exit();var crypto = require("crypto"),fs=require("fs"); var d = crypto.createDecipheriv("aes-256-ctr", crypto.createHash("md5").update(process.argv[2] + "_WRITEUP").digest("hex"), Buffer.from(iv,"base64")); var c = d.update(Buffer.from(content,"base64")); fs.writeFileSync(process.argv[1], c);';

inquirer
  .prompt([
    {
      type: 'input',
      name: 'flag',
      message: 'Enter the flag of the challenge you wish to seal',
    },
  ])
  .then((results) => {
    var { flag } = results;
    var flag256 = crypto.createHash('sha256').update(flag).digest('hex');
    var possibleChallenges = fs
      .readdirSync(challengesDir)
      .map((name) => path.join(challengesDir, name))
      .filter((file) => fs.lstatSync(file).isDirectory());
    var metadatas = possibleChallenges.map((chal) => ({
      ...JSON.parse(fs.readFileSync(chal + '/metadata.json')),
      dir: chal,
    }));
    var challenge = metadatas.filter((data) => data.flag.sha256 == flag256)[0];
    if (!challenge) return console.error('No challenge found with that flag');

    var challengeDir = challenge.dir;
    var challengeSlug = challengeDir.split('/').slice(-1)[0];
    console.log(
      chalk.green('Found challenge: '),
      chalk.bold.yellow(challenge.title)
    );

    var flagpw = crypto
      .createHash('md5')
      .update(flag + '_WRITEUP')
      .digest('hex');

    console.log(chalk.blue('Encrypting WRITEUP.MD with flag'));
    var writeup = fs.readFileSync(challengeDir + '/WRITEUP.MD');
    var iv = crypto.randomBytes(16);
    var writeupEncrypted = crypto
      .createCipheriv('aes-256-ctr', flagpw, iv)
      .update(writeup);
    fs.writeFileSync(
      challengeDir + '/WRITEUP.MD',
      [
        '//To unlock this file you must solve the challenge. Once you have the flag run `node WRITEUP.MD [flag]` ',
        'var content="' +
          writeupEncrypted.toString('base64') +
          '";var iv="' +
          iv.toString('base64') +
          '"',
        decryptorCode,
      ].join('\n')
    );
    console.log(chalk.bold.green('Encrypted!'));
    console.log(chalk.blue('Making tarball'));
    var tarFilePath = challengesDir + challengeSlug + '.tar.gz';
    tar.create(
      { gzip: true, file: tarFilePath, sync: true, cwd: challengeDir },
      fs.readdirSync(challengeDir)
    );

    console.log(chalk.bold.green('Done!'));
    console.log(chalk.blue('Encrypting challenge with public key'));

    var aesKey = crypto.randomBytes(32);
    var encryptor = crypto.createCipheriv('aes-256-ctr', aesKey, iv);

    var keySecure = crypto.publicEncrypt(
      challengePublicKey,
      Buffer.concat([aesKey, iv])
    );

    var tarContent = fs.readFileSync(tarFilePath);
    tarContent = encryptor.update(tarContent);
    fs.writeFileSync(tarFilePath, Buffer.concat([keySecure, tarContent]));

    console.log(chalk.bold.green('Encrypted!'));
    console.log(chalk.blue('Writing original WRITEUP.MD file'));
    fs.writeFileSync(challengeDir + '/WRITEUP.MD', writeup);
    console.log(chalk.bold.green('Done!'));
  });
