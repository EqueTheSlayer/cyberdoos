import {
	Client,
	Events,
	Collection,
	BaseInteraction, EmbedBuilder, GuildMember, TextChannel
} from 'discord.js';
import { ClientModel } from "./models/client.model";
import { Token, AnnaId, BannedGuildId, GuildId, JujaId, JujaMainChannelId, BirthdayList } from './config.json';
import { mongoConnectAddress, databaseName, guildCollection } from './mongoConfig.json';
import path from 'path';
import fs from 'fs';
import { DisTube } from 'distube';
import { colors, getRandomElement, sendMessage, updateGuildInDb, updateSlashCommands } from "./utils";
import { distubeModel, FormattedSongForAnswer } from "./models/distube.model";
import {
	imagesForGoodNightWishes,
	isGoodNightWish,
	BotGuildData,
	nameForAnya, NightJuj
} from "./models/main.model";
import { repeatType } from "./models/play.model";
import { next, playPause, previous, repeat, row, row2, status, stop } from "./components/buttons";
import { MongoClient } from "mongodb";
import { schedule } from "node-cron";

const client: ClientModel = new Client({intents: ['Guilds', 'GuildVoiceStates', 'GuildMessages', 'GuildMembers', 'MessageContent']});
const mongoClient = new MongoClient(mongoConnectAddress);

client.on(Events.GuildCreate, async (guild) => {
	if (guild.id === BannedGuildId) {
		void guild.leave()
	}
	await updateGuildInDb(mongoClient, guild.id);

	await updateSlashCommands(guild.id)
});

client.once(Events.ClientReady, async (c) => {
	console.log(`Бот авторизован как ${c.user.tag}`);

	await Promise.all(c.guilds.cache.map(guild => {
		updateGuildInDb(mongoClient, guild.id);
		if (guild.id === BannedGuildId) {
			guild.leave();
		}
	}));

	await updateSlashCommands(mongoClient);

	// await dtfSocket(mongoClient, client);

	schedule('00 00 * * *', async () => {
		BirthdayList.map(userBirth => {
			const date = new Date().getDate();
			const month = new Date().getMonth();
			if (userBirth.day === `${date}/${month + 1}`) {
				c.guilds.cache.map(guild => {
					if (guild.id === GuildId) {
						guild.members.fetch(userBirth.id).then(result => {
							const userImage = result.displayAvatarURL({size: 1024});
							const messageChannel = guild.channels.cache.get(JujaMainChannelId) as TextChannel;

							sendMessage(messageChannel, {
								thumbnail: userImage,
								title: 'У кого сегодня день рождения?',
								description: `Так это же ${result.user}!\n Ультрамегагипержестко поздравляем!`
							}, false);
							result.edit({nick: `${userBirth.desc} ${result.nickname}`})
						});
					}
				});
			}
		});
	});

	schedule('00 00 * * *', async () => {
		c.guilds.cache.map(guild => {
			if (guild.id === GuildId) {
				guild.members.fetch(JujaId).then(result => {
					result.edit({nick: 'Ночной Жуж'});
				});
				const messageChannel = guild.channels.cache.get(JujaMainChannelId) as TextChannel;

				sendMessage(messageChannel, {
					thumbnail: `${getRandomElement(NightJuj)}`,
					title: 'Осторожно! Ночной Жуж выходит на охоту'
				}, false);
			}
		})
	});

	schedule('00 8 * * *', async () => {
		c.guilds.cache.map(guild => {
			if (guild.id === GuildId) {
				guild.members.fetch(JujaId).then(result => {
					result.edit({nick: 'Жуж'});
				});
			}
		})
	});

	schedule('45 13 * * *', async () => {
		await mongoClient.connect();

		const db = mongoClient.db(databaseName);
		const collection = db.collection(guildCollection);

		const guilds = await collection.find<BotGuildData>({}).toArray();

		await Promise.all(guilds.map(async guild => {
			try {
				if (guild.manOfTheDay) {
					const discordGuild = await client.guilds.cache.get(guild.guildId);
					const guildUsers = await discordGuild.members.fetch();
					const randomUser: GuildMember = getRandomElement(Array.from(guildUsers))[1];
					const channel = discordGuild.channels.cache.get(guild.manOfTheDayChannel);
					const randomUserImage = randomUser.displayAvatarURL({size: 1024});
					const result = await collection.find<BotGuildData>({guildId: guild.guildId}).toArray();
					const userCreatedIndex = result[0].users.findIndex(user => user.userId === randomUser.user.id);
					const usersArray = result[0].users;
					let userCreated;
					if (userCreatedIndex > 0) {
						userCreated = usersArray[userCreatedIndex];

						userCreated.timesChosen += 1;
						usersArray[userCreatedIndex] = userCreated;
					} else {
						userCreated = {
							userId: randomUser.user.id,
							timesChosen: 1
						}
						usersArray.push(userCreated);
					}

					await collection.updateOne({guildId: guild.guildId}, {
						$set: {
							users: usersArray
						}
					});

					const color = getRandomElement(colors);
					//@ts-ignore
					channel.send({
						embeds: [
							new EmbedBuilder()
								.setColor(color)
								.setDescription(`${randomUser.user} поздравляю! Ты стал(а) главным \n пидорасом на сегодняшний день` || null)
								.setImage(randomUserImage || null)
								.setTitle('РУБРИКА "ПИДОРАС ДНЯ"' || null)
								.addFields({
									name: 'Был(а) главным пидорасом дня:',
									value: `${userCreated.timesChosen} раз(а)` || null
								})
						]
					})
				}
			} catch (err) {
				console.log(err)
			}

		}));

		await mongoClient?.close();
	});
});

client.on(Events.InteractionCreate, async (interaction) => {
	const previousEmoji = client.emojis.cache.get("1104726827756429343"),
		nextEmoji = client.emojis.cache.get("1104731726518943784"),
		stopEmoji = client.emojis.cache.get("1104731761151324170"),
		statusEmoji = client.emojis.cache.get("1104732831290236978"),
		playPauseEmoji = client.emojis.cache.get("1104731744957120522"),
		repeatListEmoji = client.emojis.cache.get("1104731776443764787"),
		repeatSongEmoji = client.emojis.cache.get("1104733022168809532");

	next.setEmoji(nextEmoji.toString());
	previous.setEmoji(previousEmoji.toString());
	playPause.setEmoji(playPauseEmoji.toString());
	playPause.setEmoji(playPauseEmoji.toString());
	stop.setEmoji(stopEmoji.toString());
	status.setEmoji(statusEmoji.toString());
	repeat.setEmoji(repeatListEmoji.toString())

	if (interaction.isButton()) {
		const {member} = interaction;
		//@ts-ignore
		const voiceChannel = member?.voice.channel;
		const queue = await client.distube?.getQueue(voiceChannel);
		switch (interaction.customId) {
			case 'next':
				await interaction.deferReply({ephemeral: true});
				await queue?.skip();
				//@ts-ignore
				await interaction.editReply({content: 'Включаю следующую песню', components: [row, row2]});
				break;
			case 'previous':
				if (queue.previousSongs.length > 0) {
					await interaction.deferReply({ephemeral: true});
					await queue?.previous();
					//@ts-ignore
					await interaction.editReply({content: 'Включаю предыдущюю песню', components: [row, row2]});
				}
				break;
			case 'playPause':
				await interaction.deferReply({ephemeral: true});
				if (queue.paused) {
					queue.resume();
					//@ts-ignore
					await interaction.editReply({content: 'Продолжаю воспроизведение песни', components: [row, row2]});
					break;
				}
				queue.pause();
				//@ts-ignore
				await interaction.editReply({content: 'Останавливаю песню', components: [row, row2]});
				break;
			case 'stop':
				await interaction.deferReply({ephemeral: true});
				await queue?.stop();
				//@ts-ignore
				await interaction.editReply({content: 'Выключаю песню и обнуляю очередь'});
				break;
			case 'status':
				//@ts-ignore
				await interaction.reply({
					content: `Сейчас играет: ${queue.songs[0].name}. ${repeatType[queue.repeatMode]}`,
					ephemeral: true,
					components: [row, row2]
				});
				break;
			case 'repeat':
				await interaction.deferReply({ephemeral: true});
				await queue?.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1);
				repeat.setStyle(queue.repeatMode > 0 ? 1 : 2)
				repeat.setEmoji(queue.repeatMode === 2 ? repeatListEmoji.toString() : repeatSongEmoji.toString())
				//@ts-ignore
				await interaction.editReply({content: repeatType[queue.repeatMode], components: [row, row2]});
				break;
		}
	}
});


client.distube = new DisTube(client, distubeModel);

client.commands = new Collection<string, { data: '', execute: () => {} }>();

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

client.on('messageCreate', (message) => {
	if (AnnaId.includes(message.author.id) && isGoodNightWish(message.content.toLowerCase())) {
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

// TODO СДЕЛАТЬ ОБРАБОТЧИК ЭВЕНТОВ ПО АНАЛОГИИ С КОМАНДАМИ

client.distube
	.on('addSong', (queue, song) => {
		const answerString = queue.songs.length > 1
			? `добавлен в очередь пользователем ${song.user}`
			: `по заказу ${song.user}`;

		const formattedSong: FormattedSongForAnswer = {
			thumbnail: song.thumbnail,
			description: answerString,
			title: song.name,
			url: song.url
		}

		sendMessage(queue.textChannel as TextChannel, formattedSong)
	})
	.on('error', (textChannel, e) => {
		//TODO шо за цифры
		sendMessage(textChannel as TextChannel, {
			description: `Ошибка: ${e.message.slice(0, 2000)}`,
		})
		console.error(e);
	})
	.on('finish', queue => {
		sendMessage(queue.textChannel as TextChannel, {
			title: 'Песни кончились',
			thumbnail: 'https://i.redd.it/pn1n2ctvla231.jpg',
		})
	});

//TODO СДЕЛАТЬ МЕХАНИКУ ПЕРЕСТРЕЛОК В НОВОЙ КОМАНДЕ

void client.login(Token);