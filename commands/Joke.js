const CommandBase = require('./CommandBase');
const fetch = require('node-fetch');

class Joke extends CommandBase {


  getJoke = () => {
    fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
      .then(data => data.json())
      .then(insult => this.reply(insult.insult));
  }

  run = () => {
    this.getJoke();
  }

  static command = (prefix) => `${prefix}true`;
}

module.exports = Joke;
