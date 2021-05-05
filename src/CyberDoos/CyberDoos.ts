import * as Discord from "discord.js";
import {Message} from "discord.js";
import "lib/discordAPI/InlineMessage";
import {Config} from "models/Config.model";
import {CommandHandler, CommandList} from "models/Command.model";
import {CommandBase} from "commands/CommandBase";
import {CommandChecker} from "CommandChecker/CommandChecker";
import {colors} from "./CyberDoos.model";
import {getRandomElement} from "../utils";


export class CyberDoos<T extends CommandBase> {
  private bot: Discord.Client = null;
  private config: Config = null;
  private commandChecker: CommandChecker<CommandBase>;
  private readonly commandHandler: CommandHandler;

  constructor(config: Config, commands: CommandList<CommandBase>) {
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

  private static answer(message: Message, answer: string) {
    // @ts-ignore
    message.inlineReply({
      embed: {
        description: answer,
        color: getRandomElement(colors),
      }
    });
  }
}

