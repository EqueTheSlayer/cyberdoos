import {
    Client,
    Events,
    Collection,
    BaseInteraction, EmbedBuilder,
} from 'discord.js';
import {ClientModel} from "./models/client.model";
import {Token, AnnaId} from './config.json';
import path from 'path';
import fs from 'fs';
import {DisTube} from 'distube';
import {colors, getRandomElement, sendMessage} from "./utils";
import {distubeModel, FormattedSongForAnswer} from "./models/distube.model";
import {imagesForGoodNightWishes, isGoodNightWish, nameForAnya} from "./models/main.model";

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages', 'MessageContent']});

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

//пожелание спокойной ночи одному человеку
client.on('messageCreate', (message) => {
    if (message.author.id === AnnaId && isGoodNightWish(message.content.toLowerCase())) {
        void message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(getRandomElement(colors))
                    .setTitle(`Спокойной ночи ${getRandomElement(nameForAnya)}, сладких тебе сновидений`)
                    .setImage(getRandomElement(imagesForGoodNightWishes))
            ]
        });
    }
});

// TODO переделать строку с ответом в объект с типом embed?, чтоб нормально можно было юзать embed (title, thumbnail, description и тд)
// TODO СДЕЛАТЬ ОБРАБОТЧИК ЭВЕНТОВ ПО АНАЛОГИИ С КОМАНДАМИ

client.distube
    .on('addSong', (queue, song) => {
        const answerString = queue.songs.length > 1
            ? `добавлен в очередь пользователем ${song.user}`
            : `по заказу ${song.user}`;

        const formattedSong: FormattedSongForAnswer = {
            thumbnail: song.thumbnail,
            description: answerString,
            title: song.name
        }

        sendMessage(queue.textChannel, formattedSong)
    })
    .on('error', (textChannel, e) => {
        //TODO шо за цифры
        sendMessage(textChannel, {
            description: `Ошибка: ${e.message.slice(0, 2000)}`,
        })
        console.error(e);
    })
    .on('finish', queue => {
        sendMessage(queue.textChannel, {
            title: 'Песни кончились',
            thumbnail: 'https://i.redd.it/pn1n2ctvla231.jpg',
        })
    });

//TODO СДЕЛАТЬ МЕХАНИКУ ПЕРЕСТРЕЛОК В НОВОЙ КОМАНДЕ

void client.login(Token);