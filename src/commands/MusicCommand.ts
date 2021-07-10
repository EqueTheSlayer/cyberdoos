import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {Play} from "../models/Play.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";
import {colors, timeout} from "../CyberDoos/CyberDoos.model";
import {decode} from 'html-entities';
import {VoiceConnection} from "discord.js";
import {getRandomElement} from "../utils";
import "lib/discordAPI/InlineMessage";

export class MusicCommand implements CommandBase {
  commandName = ["play", "stop", "next", "queue"];

  play: Play = {
    connection: null,
    dispatcher: null,
  };
  isHandler: boolean = true;
  queue: Array<{ songName: string, songLink: string }> = [];
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
      case 'next':
        return this.nextSong(message);
    }
  }

  connectToVoiceChannel(message: Message) {
    if (message.member.voice.channel) return message.member.voice.channel.join();
  }

  playStream(message: Message, args: string[]): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.play.connection = await this.connectToVoiceChannel(message);
      if (!this.play.connection) {
        resolve('Сначала зайди на голосовой канал!');
        return;
      }

      await youtubeSearch(args.join(' '), this.searchOptions, (err: Error, results: YouTubeSearchResults[] | undefined) => {

        if (err) reject(err);

        this.queue.push({
          songName: decode(results[0].title),
          songLink: decode(results[0].link)
        });

        this.queue.length > 1 ? resolve(`${this.queue[this.queue.length - 1].songName} добавлена в очередь.`) : resolve(this.playSong(message));
      });
    })
  }

  finishSongHandler(message: Message) {
    if (!this.isHandler) return;

    this.play.dispatcher.on('finish', () => {
      this.nextSong(message);

      // @ts-ignore
      this.queue[0] && message.inlineReply({
        embed: {
          description: `Воспроизвожу ${this.queue[0].songName}`,
          color: getRandomElement(colors),
        }
      });
    })
  }

  playSong(message: Message) {
    this.play.dispatcher = this.play.connection.play(ytdl(this.queue[0].songLink, {filter: "audioonly"}));
    this.finishSongHandler(message);

    return `Воспроизвожу ${this.queue[0]?.songName}`;
  }

  stopStream(message: Message) {
    if (this.play.dispatcher) {
      this.play.dispatcher.destroy();
      this.queue = [];
      this.leaveChannel(message, timeout);

      return 'Песню спел, пора по койкам';
    }

    return 'А никаких песен и не играет';
  }

  nextSong(message: Message) {
    if (this.queue.length > 1) {
      this.queue.shift();

      return this.playSong(message);
    }
    this.queue = [];

    return 'В очереди нет песен';
  }

  leaveChannel(message: Message, timeout: number) {
    setTimeout(() => {
      message.member.voice.channel.leave();
    }, timeout);
  }
}

