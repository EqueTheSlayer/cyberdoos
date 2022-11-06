import {CommandBase} from "commands/CommandBase";
import {Message} from "discord.js";
import {MusicCommandName, Play} from "../models/MusicCommand.model";
import ytdl from "ytdl-core";
import config from "../botconfig.json";
import youtubeSearch, {YouTubeSearchResults} from "youtube-search";
import {timeout} from "../CyberDoos/CyberDoos.model";
import {decode} from 'html-entities';
import "lib/discordAPI/InlineMessage";
import Timeout = NodeJS.Timeout;

export class MusicCommand implements CommandBase {
  commandName = [MusicCommandName.Play, MusicCommandName.Stop, MusicCommandName.Next, MusicCommandName.Queue, MusicCommandName.Louder, MusicCommandName.Quieter];
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

  do(command: MusicCommandName, args: string[], message: Message) {
    switch (command) {
      case MusicCommandName.Play:
        return this.playStream(message, args);
      case MusicCommandName.Stop:
        return this.stopStream(message);
      case MusicCommandName.Next:
        return this.nextSong(message);
      case MusicCommandName.Louder:
        return this.louderMusic();
      case MusicCommandName.Quieter:
        return this.quieterMusic();
    }
  }

  connectToVoiceChannel(message: Message) {
    if (message.member.voice.channel) return message.member.voice.channel.join();
  }

  louderMusic() {
    if (this.play.dispatcher) {
      this.play.dispatcher.setVolume(this.play.dispatcher.volume + 0.25);
      return {
        title: 'Увеличил громкость музыкального произведения на 25%'
      }
    }

    return {title: 'В данный момент воспроизведение музыкального произведения отрицательно присутствует'};
  }

  quieterMusic() {
    if (this.play.dispatcher) {
      this.play.dispatcher.setVolume(this.play.dispatcher.volume - 0.25);
      return {
        title: 'Уменьшил громкость музыкального произведения на 25%'
      }
    }

    return {title: 'В данный момент воспроизведение музыкального произведения отрицательно присутствует'};
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
          this.queue.push({
            songName: decode(title),
            songLink: decode(link),
            songImage: decode(thumbnails.default.url)
          });

          this.queue.length > 1
            ? resolve({
              description: 'Следующее музыкальное произведение было добавлено в очередь',
              title: this.queue[this.queue.length - 1].songName,
              image: this.queue[this.queue.length - 1].songImage
            })
            : resolve(this.playSong(message));
        } catch (e) {
          console.log(e);
        }
      });
    })
  }


  finishSongHandler(message: Message) {
    const {songName, songImage} = this.queue[0];

    this.play.dispatcher.on('finish', () => {
      return this.nextSong(message);
    });

    return {
      title: songName,
      image: songImage,
      description: 'CyberDOOS представляет вашему вниманию композицию'
    };
  }

  playSong(message: Message) {
    const {songLink} = this.queue[0];
    const stream = ytdl(songLink, {
      filter: "audioonly",
      requestOptions: {
        headers: {
          cookie: config.cookieForYouTube
        }
      }
    });
    this.play.dispatcher = this.play.connection.play(stream);

    clearTimeout(this.leaveChannelTimeout);

    return this.finishSongHandler(message);
  }

  stopStream(message: Message) {
    if (this.play.dispatcher) {
      this.play.dispatcher.destroy();
      this.queue = [];
      this.leaveChannel(message, timeout);

      return {
        title: 'Процесс пения закончил я, пришла пора уйти за занавес',
        image: 'http://1.bp.blogspot.com/--InTDMsbqcM/Tqbfi-zEsXI/AAAAAAAAADs/WuxFWbnrwCc/s1600/6528975-man-raising-the-hat-3d-rendered-illustration.jpg',
      };
    }

    return {title: 'В данный момент воспроизведение музыкального произведения отрицательно присутствует'};
  }

  nextSong(message: Message) {
    if (this.queue.length > 1) {
      this.queue.shift();
      return this.playSong(message);
    }

    this.queue = [];
    this.leaveChannel(message, timeout);
    return {title: 'В очереди нет музыкальных произведений'};
  }

  leaveChannel(message: Message, timeout: number) {
    this.leaveChannelTimeout = setTimeout(() => {
      message.member.voice.channel.leave();
    }, timeout);
  }
}

