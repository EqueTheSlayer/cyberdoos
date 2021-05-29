import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {Play} from "../models/Play.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";
import {timeout} from "../CyberDoos/CyberDoos.model";

export class MusicCommand implements CommandBase {
    commandName = ["play", "stop", "next", "queue"];
    play: Play = {
        connection: null,
        dispatcher: null,
    };
    searchOptions: youtubeSearch.YouTubeSearchOptions = {
        maxResults: 1,
        key: config.youtubeToken,
        order: 'relevance'
    }

    do(command: string, args: string[], message: Message) {
        switch (command) {
            case 'play':
                return this.playStream(message, args);
            case 'stop':
                return this.stopStream(message);
        }
    }

    connect(message: Message) {
        if (message.member.voice.channel) {
            return message.member.voice.channel.join();
        } else {
            let guy = 'Сначала зайди на какой-нибудь голосовой канал';
        }
    }

    playStream(message:Message, args: string[]):Promise<string> {
        return new Promise(async (resolve, reject) => {
            this.play.connection = await this.connect(message);
            await youtubeSearch(args.join(' '), this.searchOptions, (err: Error, results: YouTubeSearchResults[] | undefined) => {
                if (err) reject(err);
                this.play.dispatcher = this.play.connection.play(ytdl(results[0].link, {filter: "audioonly"}));
                resolve(`Воспроизвожу ${results[0].title}`);
            });
        })
    }

    stopStream(message:Message) {
        this.play.dispatcher.destroy();
        this.leaveChannel(message, timeout);

        return 'Песню спел, а теперь сыбался';
    }

    leaveChannel(message:Message, timeout:number) {
        setTimeout(() => {
            message.member.voice.channel.leave();
        }, timeout);
    }
}

