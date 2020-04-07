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
let servers = {};
const ytdl = require('ytdl-core');

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
    if ((msg.author.id !== '281120774289489922') || (msg.author.id !== '274610371417866242')) {
        //музыкальная функция
        let args = msg.content.substring(prefix.length).split(' ');
        switch (args[0]) {
            case 'play':

                function play(connection, message) {
                    let server = servers[msg.guild.id];

                    server.dispatcher = connection.play(ytdl(server.queue[0], { filter: 'audioonly' }));

                    server.queue.shift();

                    server.dispatcher.on('end', function () {
                        if (server.queue[0]) {
                            play(connection, msg);
                        } else {
                            connection.disconnect();
                        }
                    })
                }

                if (!args[1]) {
                    msg.channel.send(`\`\`\`Сначала укажи ссылку на песню, 🤡\`\`\``);
                    return;
                }

                if (!msg.member.voice.channel) {
                    msg.channel.send(`\`\`\`Чтобы я спел для тебя, зайди на любой голосовой канал, 🤡\`\`\``);
                    return;
                }

                if (!servers[msg.guild.id]) servers[msg.guild.id] = {
                    queue: []
                }

                let server = servers[msg.guild.id];

                server.queue.push(args[1]);

                if (!msg.guild.voiceConnection) msg.member.voice.channel.join().then(function (connection) {
                    play(connection, msg);
                })

                break;

            case 'skip':
                let server2 = servers[msg.guild.id];
                if (server2.dispatcher) server2.dispatcher.end();
                msg.channel.send(`\`\`\`Включаю следующую песню🎤🎤🎤\`\`\``)
                break;

            case 'stop':
                let server3 = servers[msg.guild.id];
                console.log(server3)
                if (msg.member.voice.channel) {
                    for (let i = server3.queue.length - 1; i >= 0; i--) {
                        server3.queue.splice(i, 1);
                    }
                    server3.dispatcher.end();
                    msg.channel.send(`\`\`\`💀💀💀Ваша песенка спета💀💀💀\`\`\``);
                }
                break;
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
    };
    if ((msg.author.id === '281120774289489922' || msg.author.id ==='274610371417866242') && msg.content.startsWith(`${prefix}`)) {
        msg.reply('\`\`\`Ты кто нахуй такой шобы мне приказывать????? Отсоси пятнадцать камней из раста, 🤡\`\`\`');
    }
});
bot.login(token);





