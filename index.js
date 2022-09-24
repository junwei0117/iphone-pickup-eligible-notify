import axios from 'axios';
import TelegramBot from "node-telegram-bot-api";
import {targets, telegramAPIToken, chatID, targetMap} from './config.js'

const bot = new TelegramBot(telegramAPIToken, {polling: true});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const start = async () => {
  while(true) {
    targets.forEach(async model => {
      try {
        const storeResponse = await axios.get(`https://www.apple.com/tw/shop/fulfillment-messages?pl=true&mts.0=regular&mts.1=compact&parts.0=${model}&searchNearby=true&&store=R713`)
        storeResponse.data.body.content.pickupMessage.stores.forEach(store => {
          console.log(`${model}: ${store.storeName}: ${store.partsAvailability[model].pickupDisplay}`)
          if (store.partsAvailability[model].pickupDisplay == "available") {
            bot.sendMessage(chatID, `${targetMap[model]} : ${model}: ${store.storeName}`);
          }
        })
      } catch (err) {
        console.log(err.data)
      }
    })

    await wait(3000)
  }
}

start()
