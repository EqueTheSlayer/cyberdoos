import {CommandBase} from "commands/CommandBase";
import {APIMessageContentResolvable, Message, MessageEmbed} from "discord.js";
import {CommandHandler, CommandList} from "models/Command.model";
import {log} from "util";
import {getRandomElement} from "../utils";
import {colors} from "../CyberDoos/CyberDoos.model";


export class CommandChecker<T extends CommandBase> {
  private commandMap: {
    [key: string]: CommandBase
  } = null;
  private readonly prefix: string = null;

  constructor(prefix: string, commands: CommandList<CommandBase>) {
    this.prefix = prefix;
    this.commandMap = commands.reduce((commandMap, Command) => {
      const command = new Command();

      if (typeof command.commandName === "string") {
        return {
          ...commandMap,
          [command.commandName]: command
        };
      }

      const currentCommandMap = command.commandName.reduce((localCommandMap, localCommandName) => {
        return {
          ...localCommandMap,
          [localCommandName]: command
        };
      }, {});

      return {
        ...commandMap,
        ...currentCommandMap
      };
    }, {});
  }

  private getCommandArguments(message: APIMessageContentResolvable & string) {
    const [commandName, ...commandArguments] = message.split(" ");
    return {
      commandName: commandName.replace(this.prefix, "").toLowerCase(),
      commandArguments
    };
  }

  public getCommandHandler = (callback: (message: Message, answer: any) => void) => {
    return (message: Message, disablePrefix?: boolean) => {

      if (message.author.bot === false && (disablePrefix || message.content.startsWith(this.prefix))) {
        const {commandName, commandArguments} = this.getCommandArguments(message.content);

        if (this.commandMap.hasOwnProperty(commandName)) {
          const answer = this.commandMap[commandName].do(commandName, commandArguments, message);
            const embedMessage = (text: any) => {
              return new MessageEmbed()
                .setColor(getRandomElement(colors))
                .setTitle(text.title || null)
                .setThumbnail(text.image || null)
                .setAuthor(text.description || null)
            }
          answer instanceof Promise ? answer.then(text => callback(message, embedMessage(text))) : callback(message, embedMessage(answer));
        }
      }
    }
  };
}
