const CommandBase = require('./CommandBase');
const Calculator = require('./Calculator');
const Help = require('./Help');
const CoinFlip = require('./CoinFlip');
const RandomNumber = require('./RandomNumber');
const Joke = require('./Joke');

class CommandChecker extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.commands = {
      '!calc': Calculator,
      '!help': Help,
      '!flip': CoinFlip,
      '!roll': RandomNumber,
      '!joke': Joke
    }
    this.deletingMsg();
  }

  commandCheck = () => {
    const args = this.getArgs();
    if(args) {
      for (let key in this.commands) {
        if (args[0] === key) {
          let obj = new this.commands[key](this.prefix, this.msg);
          obj.run();
        }
      }
    }
  }
}

module.exports = CommandChecker;
