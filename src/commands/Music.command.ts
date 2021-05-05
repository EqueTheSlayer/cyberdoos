import {CommandBase} from "commands/CommandBase";
import {getRandomElement} from "utils";
import {Message} from "discord.js";

export class MusicCommand implements CommandBase {
    commandName = ["play", "stop", "next", "queue"];
    songQueue = {};

    do(command:string, args:string[], message:Message) {
        if (message.member.voice.channel) {
            switch (command){
                case ('play'):
                    return this.play(args, message);
                case ('stop'):
                    return this.stop();
                case ('next'):
                    return this.next();
                case ('queue'):
                    return this.queue();
            }
        } else {
            return 'Сперва зайди на канал, дурень';
        }
    }

    play(args:string[], message: Message) {
        const connection = message.member.voice.channel.join();

        return '13';
    }

    stop() {
        return 'Песня остановлена'
    }

    next() {
        return 'Воспроизвожу следующую песню'
    }

    queue() {
        return 'Очередь из песен: '
    }


}

// if (msg.content.startsWith(`${prefix}play`) && msg.author.bot === false) {
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
//         msg.reply("");
//       }
//     }
//
//     if (msg.content.startsWith(`${prefix}stop`) && msg.author.bot === false) {
//       play.dispatcher.destroy();
//       msg.member.voice.channel.leave();
//     }

