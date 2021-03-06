import {CommandBase} from "commands/CommandBase";
import {APIMessageContentResolvable, Message} from "discord.js";
import {CommandHandler, CommandList} from "models/Command.model";


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
      commandName: commandName.replace(this.prefix, ""),
      commandArguments
    };
  }

  public getCommandHandler = (callback: (message: Message, answer: string) => void) => {
    return (message: Message, disablePrefix?:boolean) => {
      if (message.author.bot === false && (disablePrefix || message.content.startsWith(this.prefix) )) {
        const {commandName, commandArguments} = this.getCommandArguments(message.content);

        if (this.commandMap.hasOwnProperty(commandName)) {
          const answer = this.commandMap[commandName].do(commandName, commandArguments, message);
          if (answer instanceof Promise) {
            answer.then(text => callback(message, text));
          } else {
            callback(message, answer);
          }
        }
      }
    }
  };
}
