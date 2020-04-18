const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
const apiKey = '9552deb6aed115532d3abdc34e24d985';
const city = 'volgograd';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=RU&appid=${apiKey}`;
const express = require("express");
const path = require('path');
const PORT = process.env.PORT || 5016;
const ytdl = require('ytdl-core');
const queue = new Map();
const search = require('youtube-search');
const opts = {
    maxResults: 1,
    key: config.YOUTUBE_API,
    type: 'video',
    order: 'relevance'
}

let http = require("http");
setInterval(function () {
    http.get('http://cyberdoos.herokuapp.com');
}, 300000);

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//ссылка приглашение бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
    bot.user.setActivity('🤖кибержизнь🤖')
});

bot.on('message', async msg => {
    //черный список
    if ((msg.author.id === '281120774289489922' || msg.author.id === '274614692385652737') && msg.content.includes(`${prefix}`)) {
        msg.reply('\`\`\`🤖🤖🤖По какому праву ты что-то говоришь мне❓❓❓ Сначала научись себя вести, 🤡🤡🤡\`\`\`');
    } else {
        //!help список команд
        if (msg.content.startsWith(`${prefix}help`)) {
            msg.reply({
                embed: {
                    color: 15105570,
                    description: `Список всех заклинаний: \n !play (название песни или ссылка)▶️\n !skip (если есть очередь)⏹️\n !stop⏯️ \n !flip (подбросить монетку)💫 \n !погода (текущая погода в Усть-Парашинске)🌞\n !вирус (статистика заболевших коронавирусом на территории РФ)💊`
                }
            })
        }
        // удаление сообщений каждые 5 минут
        if (msg.content.startsWith(`${prefix}`)) {
            msg.delete({ timeout: 300000 });
        }
        if (msg.author.bot === true) {
            msg.delete({ timeout: 300000 });
        }
        if (msg.content.startsWith(`/play`)) {
            msg.channel.send(`\`\`\`А как же я?😥😥😥\`\`\``)
        }
        //случайное число
        if (msg.content.startsWith('!roll') && msg.author.bot === false) {
            let args2 = msg.content.split(' ');
            console.log(typeof Number(args2[1]));
            if (typeof Number(args2[1]) == 'number') { 
                function getRandomInRange(max) {
                    return msg.reply({
                        embed: {
                            color: 15105570,
                            description: `Ваше число ${Math.floor(Math.random() * (max + 1))}`
                        }
                    });
                }
                getRandomInRange(Number(args2[1]));
            } else {
                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `Ты не указал числа, 🤡`
                    }
                })
            }
        }
        //подброс монетки
        if (msg.content.startsWith(`${prefix}flip`)) {
            const coins = ['орел', 'решка'];
            let flip = coins[Math.floor(Math.random() * 2)];
            if (flip === 'орел') {
                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `Выпал орёл`
                    }
                });
            } else {
                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `Выпала решка`
                    }
                });
            }
        }
        //музыкальная функция
        const serverQueue = queue.get(msg.guild.id);

        if (msg.content.startsWith(`${prefix}play`)) {
            execute(msg, serverQueue);
            return;
        } else if (msg.content.startsWith(`${prefix}skip`)) {
            skip(msg, serverQueue);
            return;
        } else if (msg.content.startsWith(`${prefix}stop`)) {
            stop(msg, serverQueue);
            return;
        }
        //коронавирус
        if (msg.content.search(`${prefix}[ВвB][Ии][РрPp][УуYy][CcСс]`) > -1 && msg.author.bot === false) {
            request("https://pomber.github.io/covid19/timeseries.json", function (err, response, body) {
                if (err) {
                    console.log('covid ошибка')
                } else {
                    let covidData = JSON.parse(body);
                    let lastday = covidData.Russia[covidData.Russia.length - 1];
                    msg.channel.send(`\`\`\`На данное время в округе Усть-Парашинска обнаружен 💊${lastday.confirmed}💊 случаев заражения COVID-19, погибло 💀${lastday.deaths}💀 человек. Ванус все еще жив🤬😭🤬😭🤬\`\`\``)
                }
            })
        }
        //погода
        if (msg.content.search(`${prefix}[Пп][ОоOo][Гг][[ОоOo][Дд][АаAa]`) > -1 && msg.author.bot === false) {
            request(url, function (err, response, body) {
                if (err) {
                    console.log('ошибка');
                } else {
                    let data = JSON.parse(body);
                    console.log(data);
                    let data2 = data.weather.find(item => item.id);
                    let temp = Math.floor(data.main.temp);
                    if (data2.description == 'ясно') {
                        msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ☀️${data2.description}☀️\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                    }
                    if (data2.description.includes('обла')) {
                        msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ⛅${data2.description}⛅\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                    }
                    if (data2.description.includes('дождь')) {
                        msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске 🌧️${data2.description}🌧️\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                    }
                    if (data2.description.includes('пасму')) {
                        msg.channel.send(`\`\`\`Сегодня в Усть-Парашинске ☁️${data2.description}☁️\nТемпература составляет 🔥${temp} градусов Цельсия🔥\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.\`\`\``);
                    }
                }
            });
        }

        console.log(msg.author.username + ' (' + msg.author.id + ') ' + ': ' + msg.content);
        async function execute(msg, serverQueue) {
            let args = msg.content.split(' ');
            let query = args.shift();
            let query2 = args.join(' ');
            let query3 = [query2];
            console.log(query3)
            let result = await search(query3, opts);
            console.log(result)
            let songLink = result.results.find(item => item.link);
            let songLink2 = songLink.link;
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send({
                embed: {
                    color: 15105570,
                    description: 'Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡'
                }
            });
            const songInfo = await ytdl.getInfo(songLink2);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };

            if (serverQueue == undefined) {
                const queueContruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };

                queue.set(msg.guild.id, queueContruct);
                queueContruct.songs.push(song);

                try {
                    let connection = await voiceChannel.join();
                    queueContruct.connection = connection;
                    play(msg.guild, queueContruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                return msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: `🤖Добавил 🎤${song.title}🎤 в очередь 🤖`
                    }
                });
            }

        }
        function play(guild, song) {
            let serverQueue = queue.get(guild.id);

            if (song == undefined) {
                setTimeout(() => {
                    serverQueue.voiceChannel.leave();
                }, 300000);
                queue.delete(guild.id);
            }
            serverQueue.dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: "audioonly" }))
            serverQueue.dispatcher.on('speaking', (value) => {
                if (!value) {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                }
            })
            msg.channel.send({
                embed: {
                    color: 15105570,
                    description: `Воспроизвожу 🎤🎤🎤 ${song.title} 🎤🎤🎤`
                }
            })
            serverQueue.dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        }

        function skip(msg, serverQueue) {
            if (Object.keys(serverQueue).length == 0) {
                return msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: 'Включи хоть одну песню, 🤡'
                    }
                })
            };
            if (!msg.member.voice.channel) {
                return msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: 'А я и не для тебя пою, 🤡'
                    }
                })
            };
            serverQueue.dispatcher.pause();
            msg.channel.send({
                embed: {
                    color: 15105570,
                    description: '🤖Включаю следующую песню🤖'
                }
            })
        }

        function stop(msg, serverQueue) {
            if (!msg.member.voice.channel) {
                return msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: 'А я и не для тебя пою, 🤡'
                    }
                })
            };
            serverQueue.songs = [];
            msg.channel.send({
                embed: {
                    color: 15105570,
                    description: `☠️☠️☠️Ваша песенка спета, отключаюсь...☠️☠️☠️`
                }
            })
            serverQueue.dispatcher.pause();
        }
    }
});
bot.login(token);