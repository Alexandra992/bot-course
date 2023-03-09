const TelegramApi = require('node-telegram-bot-api');
const {gameActions, againActions} = require('./actions');
const token = '6106080916:AAFfPIbHOcHHGgEsyd8ccCnAtcW6yVY663I';
const bot = new TelegramApi(token, {polling: true});
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты попробуй его отгадать');
  await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/97f/9ad/97f9ad34-850e-4dca-9291-e764d07d5fd6/192/38.webp')
  const randomNumber = Math.round(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай давай', gameActions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Приветствие'},
    {command: '/info', description: 'Информация о пользователе (имя, фамилия)'},
    {command: '/game', description: 'Начать игру'},  
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/192/13.webp')
      return bot.sendMessage(chatId, `Привет, май хани ${msg.from.first_name}`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/192/51.webp');
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    } else
    if (data.toString() === chats[chatId].toString()) {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/697/ba1/697ba160-9c77-3b1a-9d97-86a9ce75ff4d/3.webp')
      await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againActions)
    } else {
      await bot.sendAnimation(chatId, 'https://thumbs.gfycat.com/IncompleteMetallicChital-mobile.mp4');
      await bot.sendMessage(chatId, `К сожалению, я загадал цифру ${chats[chatId]}, но ты сильно не расстраивайся`, againActions)
    }
  })
}

start();