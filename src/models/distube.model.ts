import {CookiesForYoutube} from '../config.json';

export const distubeModel = {
    searchSongs: 5,
    searchCooldown: 30,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    youtubeCookie: CookiesForYoutube,
    nsfw: true,
}

export type FormattedSongForAnswer = {
    thumbnail?: string;
    description: string;
    title?: string;
}