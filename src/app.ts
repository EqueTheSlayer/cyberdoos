import {addPath} from "app-module-path";
addPath(__dirname);
import config from "./botconfig.json";
import {CoinFlipCommand} from "commands/CoinFlip.command";
import {CyberDoos} from "CyberDoos/CyberDoos";
import {MusicCommand} from "./commands/MusicCommand";

const commands = [CoinFlipCommand, MusicCommand];
const cyberDoos = new CyberDoos(config, commands);

cyberDoos.start();
