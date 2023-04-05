import {CookiesForYoutube} from '../config.json';
import {YtDlpPlugin} from "@distube/yt-dlp";

export const distubeModel = {
    searchSongs: 5,
    searchCooldown: 30,
    leaveOnEmpty: false,
    leaveOnFinish: true,
    leaveOnStop: false,
    youtubeCookie: CookiesForYoutube,
    nsfw: true,
    plugins: [new YtDlpPlugin({ update: true })],
}

export type FormattedSongForAnswer = {
    thumbnail: string;
    description: string;
    title: string;
}