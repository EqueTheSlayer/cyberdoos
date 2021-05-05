import {addPath} from "app-module-path";
addPath(__dirname);
import config from "./botconfig.json";
import {CoinFlipCommand} from "commands/CoinFlip.command";
import {MusicCommand} from "commands/Music.command"
import {CyberDoos} from "CyberDoos/CyberDoos";

const commands = [CoinFlipCommand, MusicCommand];
const cyberDoos = new CyberDoos(config, commands);

cyberDoos.start();
