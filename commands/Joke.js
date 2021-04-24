const CommandBase = require('./CommandBase');

class Joke extends CommandBase {
  constructor(prefix, msg) {
    super(prefix, msg);

    this.plentyOfJokes = ["Идут по лесу дюймовочка, белоснежка и xуеcoc Дюймовочка говорит:\n -Я самая маленькая на Земле. Белоснежка говорит: \n -Я самая красивая на Земле. Xуеcoc говорит: \n -Я больше всех отсосал xyёв. Идут они, в общем, и заходят в Дом Правды. Дюймовочка в слезах выбегает и говорит: \n -Блин-блин, я не самая маленькая. Меньше меня мальчик-спальчик. Белоснежка тоже выбегает в слезах и кричит: \n -Чёрт, я не самая красивая. Красивее меня спящая красавица. Выходит злой хyecос и говорит: \n -Cyкa, кто такой Илюха?🤬 🤬 🤬",
      "Умерли Илюха, Диман и Ванус. И, попав на приём к богу, все втроём взмолились: \n — Отпусти нас обратно на землю, мало мы пожили ещё, молодые совсем.  \n — Хорошо,—ответил им бог,—но только до первого соблазна. И вот очутились они на земле, в каком-то доме. Видят: пачка снюса. Диман только потянулся — тут же пропал. А Илюха и Ванус вышли из дома и пошли дальше. Вдруг видят на дороге 100 долларов лежат. Ванус наклонился за деньгами и пропали оба.💵 💵 💵",
      "Один бар был известен своим барменом, который давал представления, где он всегда угадывал, что собирается заказать клиент. \n На одном из таких представлений подходит к нему панк. Бармен долго думал, потом, на показ публике, он стукнул по стойке бутылкой пива. Панк обрадовался и пошёл на танцпол. \n Потом подходит негр. Бармен, немного подумав, показательно стукнул по стойке ведром курицы из KFC. Негр обрадовался и пошёл угонять машины. \n Потом подходит Илюха. Бармен сразу же стукнул об стойку резиновый дилдак.🍆 🍆 🍆",
      "Сын пишет письмо Деду Морозу. Рядом в кресле отдыхает свекровь.Сын: \n - Бабушка, а ты будешь писать письмо Деду Морозу? \n Свекровь: \n - Нет. \n Сын: \n- Почему? \n Свекровь: \n - Да мне вроде ничего не нужно. \n Сын: \n - Что, и новая лопата не нужна? - бабушка у нас заядлая огородница. \n Свекровь: \n - Ну, лопата, может, и нужна. \n На другой день обнаружили письмо, написанное заботливым внуком. \n 'Дорогой дедушка мороз, прыщ на жопе волоснёй оброс, я не обсос, получи в ебасос, ответь скорей на мой главный вопрос'.",
      "Заходит негр в бар. Заказал пива, сидит пьет.Рядом трое белых бухают. Один говорит: \n - Эй, ниггер. Знаешь почему ты весь черный, а у тебя белые? Потому что когда я тебя красил в чруки у ерный цвет, ты руками в стены упирался. Сидят угарают. \n- Эй, ниггер. Знаешь почему ты весь черный, а у ноги у тебя белые? Потому что когда я тебя красил, ты ногами в пол упирался.Сидят дальше, угарают.Негр допивает пиво, оборачивается и говорит: \n - А знаешь почему ты весь белый, а очко у тебя черное? Потому что когда я тебя ебал, краска еще не обсохла. 🐒 🐒 🐒"]
  }

  getJoke = () => {
    const joke = this.plentyOfJokes[Math.floor(Math.random() * this.plentyOfJokes.length)];
    this.reply(joke);
  }

  run = () => {
    this.getJoke();
  }

  static command = () => `${this.prefix}joke`;
}

module.exports = Joke;
