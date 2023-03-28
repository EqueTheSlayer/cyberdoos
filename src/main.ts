import {
    Client,
    Events,
    Collection,
    BaseInteraction,
} from 'discord.js';
import {ClientModel} from "./models/client.model";
import {Token} from './config.json';
import path from 'path';
import fs from 'fs';
import {DisTube} from 'distube';
import {leaveVoiceChannel, sendMessage} from "./utils";
import {distubeModel} from "./models/distube.model";

//TODO настрой линтер ленивая жопа, я знаю это душно и не это тебе нравится в кодинге, но кто если не ты, завтрашний илюха, кто если не ты...

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages']});

client.once(Events.ClientReady, c => {
    console.log(`Бот авторизован как ${c.user.tag}`);
});

client.commands = new Collection<string, { data: '', execute: () => {}}>();

const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] У команды ${filePath} нет полей "data" или "execute".`);
    }
}

client.distube = new DisTube(client, distubeModel);

module.exports = client;

client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands!.get(interaction.commandName);
    if (!command) {
        console.error(`Команда ${interaction.commandName} не найдена.`);
        return;
    }

    try {
        await command.execute(interaction, client);

    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'При выполнении команды произошла ошибка!', ephemeral: true});
        } else {
            await interaction.reply({content: 'При выполнении команды произошла ошибка!', ephemeral: true});
        }
    }
});

// TODO переделать строку с ответом в объект с типом embed?, чтоб нормально можно было юзать embed (title, thumbnail, description и тд)
// TODO СДЕЛАТЬ ОБРАБОТЧИК ЭВЕНТОВ ПО АНАЛОГИИ С КОМАНДАМИ
client.distube
    .on('addSong', (queue, song) => {
        const answerString = queue.songs.length > 1
            ? `${song.user} добавил ${song.name} в очередь`
            : `Воспроизвожу ${song.name} по заказу ${song.user}`;

        sendMessage(queue.textChannel, answerString, song.thumbnail)
    })
    .on('error', (textChannel, e) => {
        //TODO шо за цифры
        sendMessage(textChannel, `Ошибка: ${e.message.slice(0, 2000)}`);
        console.error(e);
    })
    .on('deleteQueue', queue => {
        sendMessage(queue.textChannel, 'Песни кончились', 'https://i.redd.it/pn1n2ctvla231.jpg');
        leaveVoiceChannel(client)
    });

//TODO СДЕЛАТЬ МЕХАНИКУ ПЕРЕСТРЕЛОК В НОВОЙ КОМАНДЕ

void client.login(Token);