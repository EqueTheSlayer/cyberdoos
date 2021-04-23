const CommandBase = require('./CommandBase');

class Help extends CommandBase {

  messageReply = () => {
    let answer = `Список всех заклинаний: \n
                 ${this.prefix}roll <число> (показывает случайное число от 0 до <число>)💻\n 
                 ${this.prefix}flip (подбросить монетку)🏵️ \n
                 ${this.prefix}weather (текущая погода в указанном городе(eng))🌞\n
                 ${this.prefix}virus (статистика заболевших коронавирусом на территории РФ)💊\n 
                 ${this.prefix}joke (отправляет в чат случайный анекдот)🤣\n
                 ${this.prefix}calc <число> <+-/*> <число> (производит подсчет двух чисел)🗿`;

    this.reply(answer);
  }

  run = () => {
    this.messageReply();
  }
}

module.exports = Help;
