import {CyberDoos} from "CyberDoos/CyberDoos";
import config from "botconfig.json";
import {CoinFlipCommand} from "commands/CoinFlip.command";

const commands = [CoinFlipCommand];
const cyberDoos = new CyberDoos(config, commands);

cyberDoos.start();
