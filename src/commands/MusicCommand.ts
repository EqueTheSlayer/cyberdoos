import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {Play} from "../models/Play.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";
import {timeout} from "../CyberDoos/CyberDoos.model";
import {VoiceConnection} from "discord.js";

export class MusicCommand implements CommandBase {
  commandName = ["play", "stop", "next", "queue"];

  play: Play = {
    connection: null,
    dispatcher: null,
  };

  queue:Array<{songName: string, songLink: string}> = [];

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
          songName: results[0].title,
          songLink: results[0].link
        });

        if (this.queue.length > 1) {
          resolve(`${results[0].title} добавлена в очередь.`);
        } else {
          resolve(this.playSong(message));
        }
      });
    })
  }

  finishSongHandler(message: Message) {
    this.play.dispatcher.on('finish', () => {
      if (this.queue.length > 1) {
        this.queue.pop();
        this.playSong(message);
      } else {
        this.queue = [];
        this.leaveChannel(message, timeout);
      }
    })
  }

  playSong(message: Message) {
    this.play.dispatcher = this.play.connection.play(ytdl(this.queue[0].songLink, {filter: "audioonly"}));
    this.finishSongHandler(message);
    return `Воспроизвожу ${this.queue[0].songName}`;
  }

  stopStream(message: Message) {
    if (this.play.dispatcher) {
      this.play.dispatcher.destroy();

      this.leaveChannel(message, timeout);

      return 'Песню спел, пора по койкам';
    }

    return 'А никаких песен и не играет';
  }

  nextSong(message: Message) {
    if (this.queue.length > 1) {
      this.queue.pop();

      return this.playSong(message);
    } else {
      return 'В очереди нет песен';
    }
  }

  leaveChannel(message: Message, timeout: number) {
    setTimeout(() => {
      message.member.voice.channel.leave();
    }, timeout);
  }
}

