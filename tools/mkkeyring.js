const { generateKeyPair } = require('crypto'),
  fs = require('fs');

var keyname = process.env.KEYNAME || 'moderator';

var savePath = {
  public: __dirname + '/../keyring/' + keyname + '.pub', //yes `${}` is a thing :)
  private: __dirname + '/../keyring/' + keyname + '.key',
};

generateKeyPair(
  'rsa',
  {
    modulusLength: 4096,
  },
  (err, pub, pri) => {
    if (err) return console.error(err);
    if (fs.existsSync(savePath.public) || fs.existsSync(savePath.private))
      return console.error('Key already exists!');

    fs.writeFileSync(
      savePath.private,
      pri.export({ format: 'pem', type: 'pkcs1' })
    );
    fs.writeFileSync(
      savePath.public,
      pub.export({ format: 'pem', type: 'pkcs1' })
    );
    console.log(
      keyname,
      'key generated in (public)',
      savePath.public,
      '(private)',
      savePath.private
    );
  }
);
