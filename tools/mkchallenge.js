var inquirer = require('inquirer'),
  crypto = require('crypto'),
  chalk = require('chalk'),
  fs = require('fs'),
  path = require('path');

var moderatorPublicKey = fs.readFileSync(
  __dirname + '/../keyring/moderator.pub'
);

inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Title of the challenge',
      validate: (str) =>
        !fs.existsSync(
          __dirname +
            '/../challenges/backlog/' +
            str.replace(/ /g, '-').toLowerCase()
        ) || 'Sorry, that challenge title is already taken',
    },
    {
      type: 'input',
      name: 'authorName',
      message:
        'Name of author (if multiple authors edit metadata.json manually)',
    },
    {
      type: 'input',
      name: 'authorLink',
      message: 'Link for author',
    },
    {
      type: 'confirm',
      name: 'generateFlag',
      message: 'Do you want us to generate you a flag?',
    },
    {
      type: 'input',
      name: 'flag',
      message: 'Custom flag in STEGO{[flag]} format',
      validate: (str) =>
        str.match(/STEGO{[\S\s]*}/).length > 0 ||
        'Make sure your flag is wrapped in STEGO{[flag here]}',
      when: (hash) => !hash.generateFlag,
    },
    {
      type: 'input',
      name: 'fileName',
      message: 'Challenge file name (relative to folder)',
      default: 'challenge.jpg',
    },
  ])
  .then((results) => {
    var flag =
      results.flag ||
      'STEGO{' + crypto.randomBytes(32).toString('base64').slice(0, 32) + '}';

    var metadata = {
      version: 1,
      title: results.title,
      author: [
        {
          name: results.authorName,
          link: results.authorLink,
        },
      ],
      flag: {
        sha256: crypto.createHash('sha256').update(flag).digest('hex'),
        moderator: crypto
          .publicEncrypt(moderatorPublicKey, Buffer.from(flag))
          .toString('base64'),
      },
    };

    var challengeDir =
      __dirname +
      '/../challenges/backlog/' +
      results.title.replace(/ /g, '-').toLowerCase();

    fs.mkdirSync(challengeDir, { recursive: true });
    fs.writeFileSync(
      challengeDir + '/metadata.json',
      JSON.stringify(metadata, undefined, 4)
    );

    fs.writeFileSync(
      challengeDir + '/WRITEUP.MD',
      [
        '# ' + results.title,
        '',
        'Use this file for explaining how to solve the challenge',
        "Don't worry, to access this file after sealing you require the flag.",
        '',
        'Moderators always have access to the flag, so they will always beable to read this.',
        'However the general public can only access this once the challenge has been solved',
        '',
        'Moderators have access to this file so they can test out if a challenge is solvable',
        '',
        'In the future it is planned to try automatically validate challenges, to do this we need some `bash` script that will run and return the flag.',
        'If this is not possible because it requires manual processing, remove the following. If not, fill the following block with commands to download tools and run them.',
        'We plan on using GitHub actions as a runner for these tests - so make sure you can run the script on GitHub Actions.',
        'Please leave the line starting with #$TEST$ as it is.',
        'Your script should write your flag into $TESTOUTPUTFILE (note this will change between runs)',
        '',
        '```bash',
        '#$TEST$=' + flag,
        'echo Super compilicated command that writes to > $TESTOUTPUTFILE',
        '',
        '```',
        '',
        'You can move the above code block into any part of your code, as well as remove all this explaination text!',
        '',
        'You can use any markdown in here, just please dont upload photos, as they do not get encrypted. Instead use a service like imgur or similar to host these images, and link to them from in the MD file',
        '',
        'The floor is yours - Show us your best challenge',
        '',
        '- HexF',
      ].join('\n')
    );

    console.log(chalk.green('Success! Your challenge has been made!'));
    console.log(chalk.red.bold("Don't forget your flag!"));
    console.log(chalk.bold.blue('Flag: '), chalk.yellow(flag));
    console.log(
      chalk.cyan('Your challenge is all setup for you in'),
      chalk.yellow(path.resolve(challengeDir))
    );
    console.log(
      chalk.cyan('Once you have created the challenge and made a writeup run')
    );
    console.log(chalk.italic.yellow('npm run seal'));
    console.log(chalk.cyan('to finalize your challenge, then make your PR'));
    console.log(
      chalk.red.bold('DO NOT INCLUDE ANY CHALLENGE FILES! ONLY THE TAR.GZ FILE')
    );
  });
