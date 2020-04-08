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


let http = require("http");
setInterval(function () {
    http.get("http://cyberdoos.herokuapp.com");
}, 300000);

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//создаём ссылку-приглашение для бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
});

bot.on('message', async msg => {
    if ((msg.author.id === '281120774289489922' || msg.author.id === '274610371417866242') && msg.content.includes(`${prefix}`)) {
        msg.reply('\`\`\`🤖🤖🤖Ты кто нахуй такой шобы мне приказывать❓❓❓ Отсоси пятнадцать камней из раста, 🤡🤡🤡\`\`\`');
    } else {
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
        let voiceChannel = msg.member.voice.channel;
            let args = msg.content.split(' ');
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };
        async function execute(msg, serverQueue) {
            if (!voiceChannel) return msg.channel.send(`\`\`\`Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡\`\`\``);
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 100,
                    playing: true,
                };

                queue.set(msg.guild.id, queueContruct);

                queueContruct.songs.push(song);

                try {
                    var connection = await voiceChannel.join();
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
                return msg.channel.send(`🤖🤖🤖Добавил ${song.title} в очередь🤖🤖🤖`);
            }

        }
        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
        }
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url, { filter: "audioonly" }))
            .on('end', () => {
                console.log('\`\`\`Песня закончилась🤖🤖🤖\`\`\`');
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
        function skip(msg, serverQueue) {
            let voiceChannel = msg.member.voice.channel;
            let args = msg.content.split(' ');
            if (!voiceChannel) return msg.channel.send(`\`\`\`Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡\`\`\``);
            if (!serverQueue) return msg.channel.send('\`\`\`Тут нечего скипать, 🤡\`\`\`');
            serverQueue.connection.dispatcher.end();
        }

        function stop(msg, serverQueue) {
            let voiceChannel = msg.member.voice.channel;
            let args = msg.content.split(' ');
            if (!voiceChannel) return msg.channel.send(`\`\`\`Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡\`\`\``);
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            msg.channel.send(`\`\`\`💀💀💀Ваша песенка спета💀💀💀\`\`\``);
        }
        if (msg.content(`${prefix}`)) {
            msg.channel.send(`\`\`\`Я шо похож на Вангу❓❓❓ Конкретнее выражайтесь, господин сэр 🤡\`\`\``);
            return;
        }

        if (!voiceChannel) {
            msg.channel.send(`\`\`\`Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡\`\`\``);
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
    }
});
bot.login(token);





