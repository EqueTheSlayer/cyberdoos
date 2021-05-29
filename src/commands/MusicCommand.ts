import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {Play} from "../models/Play.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";

export class MusicCommand implements CommandBase {
    commandName = ["play", "stop", "next", "queue"];
    play: Play = {
        connection: null,
        dispatcher: null,
        timeout: 300000,
        link: null,
    };
    searchOptions: youtubeSearch.YouTubeSearchOptions = {
        maxResults: 1,
        key: config.youtubeToken,
        order: 'relevance'
    }

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
        await youtubeSearch(args.join(' '), this.searchOptions, (err: Error, results: YouTubeSearchResults[] | undefined) => {
            if (err) return console.log(err);
            this.play.dispatcher = this.play.connection.play(ytdl(results[0].link, {filter: "audioonly"}));
        });
    }

    stopStream(message:Message) {
        this.play.dispatcher.destroy();
        this.leaveChannel(message, this.play.timeout);
    }

    leaveChannel(message:Message, timeout:number) {
        setTimeout(() => {
            message.member.voice.channel.leave();
        }, timeout);
    }
}

