import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {MusicCommandName, Play} from "../models/MusicComand.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";
import {colors, timeout} from "../CyberDoos/CyberDoos.model";
import {decode} from 'html-entities';
import {getRandomElement} from "../utils";
import "lib/discordAPI/InlineMessage";
import Timeout = NodeJS.Timeout;

export class MusicCommand implements CommandBase {
  commandName = [MusicCommandName.Play, MusicCommandName.Stop, MusicCommandName.Next, MusicCommandName.Queue];
  play: Play = {
    connection: null,
    dispatcher: null,
  };
  isHandler: boolean = true;
  queue: Array<{ songName: string, songLink: string, songImage?: string }> = [];
  searchOptions: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1,
    key: config.youtubeToken,
    order: 'relevance'
  }

  leaveChannelTimeout: Timeout = null;

  //убрать any

  do(command: MusicCommandName, args: string[], message: Message) {
    switch (command) {
      case MusicCommandName.Play:
        return this.playStream(message, args);
      case MusicCommandName.Stop:
        return this.stopStream(message);
      case MusicCommandName.Next:
        return this.nextSong(message);
    }
  }

  connectToVoiceChannel(message: Message) {
    if (message.member.voice.channel) return message.member.voice.channel.join();
  }

  playStream(message: Message, args: string[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.play.connection = await this.connectToVoiceChannel(message);
      if (!this.play.connection) {
        resolve({description: 'Для начала пройдите на голосовой канал, милорд'});
        return;
      }

      await youtubeSearch(args.join(' '), this.searchOptions, (err: Error, results: YouTubeSearchResults[] | undefined) => {
        try {
          const {title, link, thumbnails} = results[0];
          console.log(results[0])

          this.queue.push({
            songName: decode(title),
            songLink: decode(link),
            songImage: decode(thumbnails.default.url)
          });

          this.queue.length > 1
            ? resolve(`${this.queue[this.queue.length - 1].songName} добавлена в очередь.`)
            : resolve(this.playSong(message));
        } catch (e) {
          console.log(e);
        }
      });
    })
  }

  finishSongHandler(message: Message) {
    this.play.dispatcher.on('finish', () => {
      this.nextSong(message);

      // @ts-ignore
      this.queue[0] && message.inlineReply({
        embed: {
          description: `${this.queue[0].songName}`,
          color: getRandomElement(colors),
        }
      });
    })
  }

  playSong(message: Message) {
    const {songLink, songName, songImage} = this.queue[0];

    this.play.dispatcher = this.play.connection.play(ytdl(songLink, {
      filter: "audioonly",
      quality: 'highestaudio',
      requestOptions: {
        headers: {
          cookie: config.cookieForYouTube
        }
      }
    }));

    clearTimeout(this.leaveChannelTimeout);
    this.finishSongHandler(message);

    return {
      title: songName,
      image: songImage,
      description: 'CyberDOOS представляет вашему вниманию композицию'
    };
  }

  stopStream(message: Message) {
    if (this.play.dispatcher) {
      this.play.dispatcher.destroy();
      this.queue = [];
      this.leaveChannel(message, timeout);

      return {description: 'Процесс пения закончил я, пришла пора уйти за занавес'};
    }

    return {description: 'В данный момент воспроизведение музыкального произведения отрицательно присутствует'};
  }

  nextSong(message: Message) {
    if (this.queue.length > 1) {
      this.queue.shift();

      return this.playSong(message);
    }
    this.queue = [];

    return {description: 'В очереди нет музыкальных произведений'};
  }

  leaveChannel(message: Message, timeout: number) {
    this.leaveChannelTimeout = setTimeout(() => {
      message.member.voice.channel.leave();
    }, timeout);
  }
}

