import * as Discord from "discord.js";
import {APIMessageContentResolvable, Message} from "discord.js";
import {Config} from "models/Config.model";
import {CommandHandler, CommandList} from "models/Command.model";
import {CommandBase} from "commands/CommandBase";
import {CommandChecker} from "CommandChecker/CommandChecker";
import "lib/discordAPI/InlineMessage";


export class CyberDoos<T extends CommandBase> {
  private bot: Discord.Client = null;
  private config: Config = null;
  private commandChecker: CommandChecker<T>;
  private readonly commandHandler: CommandHandler;

  constructor(config: Config, commands: CommandList<T>) {
    this.config = config;
    this.bot = new Discord.Client();
    this.commandChecker = new CommandChecker(this.config.prefix, commands);
    this.commandHandler = this.commandChecker.getCommandHandler(CyberDoos.answer);
  }

  public async start() {
    await this.bot.login(this.config.token);
    this.bot.on("ready", () => {
      console.log(`Запустился бот ${this.bot.user?.username}`);
      this.bot.user?.setActivity(this.config.activityStatus, {type: "LISTENING"});
    });
    this.bot.on("message", this.commandHandler);
    this.bot.on("message", this.deleteCommandAfterTimeout);
  }

  private deleteCommandAfterTimeout: CommandHandler = (message) => {
    if (message.content.startsWith(this.config.prefix) || message.author.bot === true) {
      message.delete({timeout: 300000});
    }
  };

  private static answer(message: Message, answer: APIMessageContentResolvable) {
    message.reply(answer);
  }

}

const play: {} = {
  dispatcher: null,
};

// bot.login(token).then(() => {
//   bot.on("ready", () => {
//     console.log(`Запустился бот ${bot.user?.username}`);
//     bot.user?.setActivity("Илюхуса и его прихвостней", {type: "LISTENING"});
//   });
//
//   bot.on("message", async msg => {
//     const checker = new CommandChecker(prefix, msg);
//
//     checker.commandCheck();
//
//     //голосовые связки
//     if (msg.content.startsWith(`${prefix}play`) && msg.author.bot === false) {
//       if (msg.member?.voice.channel) {
//         const link = msg.content.split(" ");
//         const connection = await msg.member.voice.channel.join();
//
//         const ytdl = require("ytdl-core");
//         let stream = ytdl(link[1], {filter: "audioonly"});
//         play.dispatcher = connection.play(stream);
//
//         play.dispatcher.on("finish", () => {
//           play.dispatcher.destroy();
//           msg.member.voice.channel.leave();
//         });
//       } else {
//         msg.reply("Сперва зайди на канал, дурень");
//       }
//     }
//
//     if (msg.content.startsWith(`${prefix}stop`) && msg.author.bot === false) {
//       play.dispatcher.destroy();
//       msg.member.voice.channel.leave();
//     }
//   });
// });

