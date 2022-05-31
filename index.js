const Discord = require("discord.js")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()

const client = new Discord.Client({intents:[]})

const cheerio = require('cheerio')
const request = require('request')


const sadWords = ["sad", "depression", "depressed", "unhappy", "angry", "sadge", "grr", "grrr", 'anxious']

heads = 0
tails = 0

const starterEncouragements = [
  "Cheer up baby!", 
  "Hang in there.", 
  "You are a great person.",
  "Keep fighting!",
  "Hwaiting!",
  "One step at a time.",
  "Never give up."
]

const ball = [
  "It is Certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Concentrate and ask again.",
  "Cannot predict now.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
]

// code for when the list is empty
db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1){
    db.set("encouragements", starterEncouragements)
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function updateEncouragements(encouragingMessage){
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
}

function deleteEncouragement(index){
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
  })
}
  
function updateSpecs(key, value){
  dict[key] = value
}

function getQuote(){
  return fetch("http://zenquotes.io/api/random").then(res => {
    return res.json()
  })
  .then(data => {
    return data[0]["q"] + " -" + data[0]["a"]
  })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) return
  
  if (msg.content === "$flip"){
    const coin = Math.floor(Math.random() * 100) + 1
    if (coin < 50){
      msg.channel.send("Heads")
      heads += 1
    }else {
      msg.channel.send("Tails")
      tails += 1 
    }
  }

  if (msg.content.startsWith("/roll")){
    rollQuery = msg.content.split("/roll ")[1]
    rollNumber = Math.floor(Math.random() * rollQuery) + 1
    msg.channel.send(rollNumber)
  }

  if (msg.content.startsWith("$8ball")){
    const ballMsg = ball[Math.floor(Math.random() * ball.length)]
    msg.channel.send(ballMsg)
  }

  if (msg.content === "$inspire"){
    getQuote().then(quote => msg.channel.send(quote))
  }

  db.get("responding"). then(responding => {
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
      })
    }
  })

  if (msg.content.startsWith("$new")){
    encouragingMessage = msg.content.split("$new ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("New encouraging message added.")
  }

  if (msg.content.startsWith("$del")){
    index = parseInt(msg.content.split("del ")[1])
    deleteEncouragement(index)
    msg.channel.send("Encouraging message deleted.")
  }

  if (msg.content.startsWith("$list")){
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }

  if (msg.content.startsWith("$responding")){
    value = msg.content.split("$responding ")[1]
    if (value.toLowerCase() == "true"){
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
        db.set("Responding", false)
      msg.channel.send("Responding is off.")
    }
  }

  if (msg.content.startsWith("$help")){
    msg.channel.send('/roll \n /$8ball \n $inspire \n $flip')
  }
})

keepAlive()
const mySecret = process.env['TOKEN']
client.login(mySecret)