import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {Play} from "../models/Play.model";
import ytdl from "ytdl-core";

export class MusicCommand implements CommandBase {
    commandName = ["play", "stop", "next", "queue"];
    play: Play = {
        connection: null,
        dispatcher: null,
        timeout: 300000,
    };

    do(command: string, args: string[], message: Message) {
        switch (command) {
            case 'play':
                this.playStream(message, args);
                break;
            case 'stop':
                this.stopStream(message);
                break;
        }
        return '123';
    }

    connect(message: Message) {
        return message.member.voice.channel.join();
    }

    async playStream(message:Message, args: string[]) {
        this.play.connection = await this.connect(message);
        this.play.dispatcher = this.play.connection.play(ytdl(args.join(''), {filter: "audioonly"}));
    }

    async stopStream(message:Message) {
        this.play.dispatcher.destroy();
        this.leaveChannel(message, this.play.timeout);
    }

    leaveChannel(message:Message, timeout:number) {
        setTimeout(() => {
            message.member.voice.channel.leave();
        }, timeout);
    }
}

