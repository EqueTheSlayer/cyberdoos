const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const config = require('./botconfig.json');
const token = config.token;
const prefix = config.prefix;
let http = require("http");
const CommandChecker = require('./commands/CommandChecker');
const play = {
    dispatcher: null,
};

http.createServer().listen(process.env.PORT || 3000);
setInterval( () => {
  http.request('http://cyberdoos.herokuapp.com/', (responce) => {
    responce.on('data', chunk => {
      console.log(chunk);
    });

    responce.on('end', () => {
      console.log('we did it');
    });
  })
}, 100000);

//ссылка приглашение бота
bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
    });
    bot.user.setActivity('🤖кибержизнь🤖')
});

bot.on('message', async msg => {
    const checker = new CommandChecker(prefix, msg);

    checker.commandCheck();

    //голосовые связки
    if (msg.content.startsWith(`${prefix}play`) && msg.author.bot === false) {
        if (msg.member.voice.channel) {
            const link = msg.content.split(' ');
            const connection = await msg.member.voice.channel.join();

            const ytdl = require('ytdl-core');
            let stream = ytdl(link[1], {filter: 'audioonly'});
            play.dispatcher = connection.play(stream);

            play.dispatcher.on('finish', () => {
                play.dispatcher.destroy();
                msg.member.voice.channel.leave();
            });
        } else {
            msg.reply('Сперва зайди на канал, дурень');
        }
    }

    if (msg.content.startsWith(`${prefix}stop`) && msg.author.bot === false) {
        play.dispatcher.destroy();
        msg.member.voice.channel.leave();
    }
    //коронавирус
    if (msg.content.search(`${prefix}[Vv][Ii][Rr][Uu][Ss]`) > -1 && msg.author.bot === false) {
        request("https://pomber.github.io/covid19/timeseries.json", function (err, response, body) {
            if (err) {
                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `⛔Увы, но что-то пошло не так⛔`
                    }
                })
            } else {
                const covidData = JSON.parse(body);
                const lastday = covidData.Russia[covidData.Russia.length - 1];

                msg.reply({
                    embed: {
                        color: 15105570,
                        description: `На данное время на территории Российской Федерации обнаружено 💊${lastday.confirmed}💊 случаев заражения COVID-19, погибло 💀${lastday.deaths}💀 человек.`
                    }
                })
            }
        })
    }
    //погода
    if (msg.content.search(`${prefix}[Ww][Ee][Aa][Tt][Hh][Ee][Rr]`) > -1 && msg.author.bot === false) {
        let weatherCountry = msg.content.split(' ');
        const apiKey = '9552deb6aed115532d3abdc34e24d985';
        weatherCountry.shift();
        let weatherCountryWithoutCommand = weatherCountry.join(' ');

        if (weatherCountryWithoutCommand.search(`[Вв][Лл][Гг]`) > -1 || weatherCountryWithoutCommand.search(`[Вв][Оо][Лл][Гг][Оо][Гг][Рр][Аа][Дд]`) > -1) {
            weatherCountryWithoutCommand = 'volgograd';
        };
        if (weatherCountryWithoutCommand.search(`[Уу][Лл]`) > -1) {
            weatherCountryWithoutCommand = 'Ust-Labinsk';
        };
        if (weatherCountryWithoutCommand.search(`[Сс][Пп][Бб]`) > -1 || weatherCountryWithoutCommand.search(`[Пп][Ии][Тт][Ее][Рр]`) > -1) {
            weatherCountryWithoutCommand = 'Saint Petersburg'
        };
        if (weatherCountryWithoutCommand.search(`[Мм][Сс][Кк]`) > -1 || weatherCountryWithoutCommand.search(`[Мм][Оо][Сс][Кк][Вв][Аа]`) > -1) {
            weatherCountryWithoutCommand = 'Moscow'
        };
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${weatherCountryWithoutCommand}&units=metric&lang=RU&appid=${apiKey}`;
        request(url, function (err, response, body) {
            let data = JSON.parse(body);
            if (data.message === 'city not found') {
                msg.channel.send({
                    embed: {
                        color: 15105570,
                        description: `❌🏙️ В моих базах данных такого города нет ❌🏙️`
                    }
                })
            } else {
                let data2 = data.weather.find(item => item.id);
                let temp = Math.floor(data.main.temp);
                if (data2.description == 'ясно') {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ☀️${data2.description}☀️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('обла')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ⛅${data2.description}⛅\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('дожд')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. 🌧️${data2.description}🌧️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('пасму')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. ☁️${data2.description}☁️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
                if (data2.description.includes('туман')) {
                    msg.channel.send({
                        embed: {
                            color: 15105570,
                            description: `${data.name}. Погода в настоящий момент. 🌫️${data2.description}🌫️\nТемпература составляет 🌈${temp} градусов Цельсия🌈\nСкорость ветра 💨${data.wind.speed} метров в секунду💨.`
                        }
                    })
                }
            }
        });
    };
})

bot.login(token);