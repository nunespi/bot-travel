require("dotenv").config();
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(process.env.API_KEY_BOT, { polling: true });

console.log("ntcn");

bot.on("message", async (msg) => {
  try {
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;

    if (text) {
      if (text === "/start") {
        await bot.sendMessage(
          chatId,
          `Добро пожаловать в чат-бот канала <a href='https://t.me/adventuresRF'>"Дневник путешественника"</a> 🙂 \n\nЗдесь вы можете поделиться фотографиями и впечатлениями о своих путешествиях и странствиях.`,
          {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: "Поделиться", callback_data: "share" }]],
            },
          }
        );
      } else {
        await bot.sendMessage(process.env.ADMIN_ID_CHAT, `Сообщение от юзера @${username}: ${text}`);
        await bot.sendMessage(
          chatId,
          `Благодарим вас! В скором времени мы внимательно ознакомимся с вашими сообщениями и опубликуем их в нашем канале. \n\nСледите за новостями <a href='https://t.me/adventuresRF'>"Дневник путешественника"</a> 🙂`,
          {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [[{ text: "Поделиться еще", callback_data: "share" }]],
            },
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", async (ctx) => {
  const chatId = ctx.chat?.id;
  try {
    console.log(ctx);
    switch (ctx.data) {
      case "share":
        await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
        await bot.sendMessage(
          ctx.message.chat.id,
          "Пришлите ответным сообщением фотографии вашего увлекательного путешествия 🌲"
        );
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("photo", async (img) => {
  try {
    await bot.sendPhoto(process.env.ADMIN_ID_CHAT, img.photo[img.photo.length - 1].file_id, {
      caption: `@${img.from.username}`,
    });
    await bot.sendMessage(
      img.chat.id,
      "Отлично! А теперь в одном сообщении немного расскажите об этом месте и о ваших впечатлениях 🌷"
    );
  } catch (error) {
    console.log(error);
  }
});
