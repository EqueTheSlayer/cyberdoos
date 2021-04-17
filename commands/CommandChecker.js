const CommandBase = require('./CommandBase');
const Calculator = require('./Calculator');
const Help = require('./Help');
const CoinFlip = require('./CoinFlip');
const RandomNumber = require('./RandomNumber');

class CommandChecker extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.commands = {
      '!calc': Calculator,
      '!help': Help,
      '!flip': CoinFlip,
      '!roll': RandomNumber
    }
    this.deletingMsg();
  }

  commandCheck = () => {
    const args = this.getArgs();
    if(args) {
      for (let key in this.commands) {
        if (args[0] === key) {
          new this.commands[key](this.prefix, this.msg);
        }
      }
    }
  }
}

module.exports = CommandChecker;