//configuration 
const Discord = require("discord.js");
const DisTube = require("distube");
const client = new Discord.Client({disableMentions: "everone"});
const config = {
    prefYour Prefix Herex: "?",
    toYour Token HereXkYWnM"
}
const distube = new DisTube(client, {searchSongs: true, emitNewSongOnly: true, highWaterMark: 1<<25})

const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave","flanger"];

const keepAlive = require("./Alive.js");

let cpuStat = require("cpu-stat");
let os = require("os");



//events
client.login(config.token);

client.on(ordusername#1234
    console.log(`Online : ${client.user.tag}`);
    client.user.setActivity(`?help | ${client.guilds.cache.size} Server`,{type: "LISTENING"});
})

client.on("message", async message => {
    if(message.author.bot){ return; }
    if(!message.guild) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if(command === "help" || command === "h"){
      embedbuilder(client, message, "GREEN", "**Best Music Bot 🎵 Commands**", `\n\n**🚀 Filters Commands**\n> \`bassboost\`, \`flanger\`, \`3d\`, \`vaporwave\`, \`nightcore\`, \`echo\`, \`karaoke\`\n\n**🎵 Music Commands**\n> \`play\`, \`stop\`, \`skip\`, \`seek\`, \`remove\`, \`queue\`, \`loop\`, \`volume\`, \`jump\`\n\n**📋 Info Commands**\n> \`cpu\`, \`ping\``)
    }

    if(command === "info" || command === "botinfo"){
      embedbuilder(client, message, "BLUE", "🎵 **__Best Music Bot Information__**", `*__🔨 Node Version:__*\n\`\`\`v12\`\`\`\n*__⚙️ Discord.js Version:__*\n\`\`\`v12.4.1\`\`\``)
    }

    if(command === "ping"){
        return embedbuilder(client, message, `BLUE`, `📶 | My Ping`, `\`\`\`${client.ws.ping} ms\`\`\``)
    }

    if(command === "cpu"){
     cpuStat.usagePercent(function (e, percent, seconds) {
      return embedbuilder(client, message, "BLUE", "***_\`\`AMD Ryzen 8 3900X\`\`\`\n**🤖 CPU Usage**\n\`\`\`${percent.toFixed(2)}%\`\`\``)
     })    
    }

    if (command === "play" || command === "p"){
        message.channel.send(`**🔍 Searching... \`\`\`${args.join(" ")}\`\`\`**`)
        return distube.play(message, args.join(" "));

      message.channel.send(newsong);
    }
    if(command === "skip" || command === "s"){
        embedbuilder(client, message, "YELLOW", "Skipped the song", `Skipped the song\n${song.name}`)
        return distube.skip(message);
    } 
    if(command === "stop" || command === "leave"){
        embedbuilder(client, message, "RED", "Stopped the queue", `Leaved the channel`)
        return distube.stop(message);
    }
    if(command === "seek"){
        embedbuilder(client, message, "GREEN", "Seeked", `seeked the song for \`${args[0]} seconds\``)
        return distube.seek(message, Number(args[0]*1000));
    } 
    if(filters.includes(command)) {
        let filter = distube.setFilter(message, command);
        return embedbuilder(client, message, "YELLOW", "Adding filter!", filter)
    }
    if(command === "volume" || command === "vol"){
        
        embedbuilder(client, message, "GREEN", "Volume", `Change the volume \`${args[0]} %\``)
        return distube.setVolume(message, args[0]);
    } 
    if (command === "queue" || command === "qu"){
        let queue = distube.getQueue(message);
        let curqueue = queue.songs.map((song, id) =>
        `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n");
        return  embedbuilder(client, message, "GREEN", "Current Queue", curqueue)
    }
    if (command === "loop" || command === "repeat"){
        if(0 <= Number(args[0]) && Number(args[0]) <= 2){
            distube.setRepeatMode(message,parseInt(args[0]))
            embedbuilder(client, message, "GREEN", "Repeat mode set to:", `${args[0].replace("0", "OFF").replace("1", "Repeat song").replace("2", "Repeat Queue")}`)
        }
        else{
            embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **2**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }
    }
    if ( command === "jump"){
        let queue = distube.getQueue(message);
        if(0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length){
            embedbuilder(client, message, "RED", "ERROR", `Jumped ${parseInt(args[0])} songs!`)
            return distube.jump(message, parseInt(args[0]))
            .catch(err => message.channel.send("Invalid song number."));
        }
        else{
            embedbuilder(client, message, "RED", "ERROR", `Please use a number between **0** and **${DisTube.getQueue(message).length}**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }

    
    }

})

//queue
const status = (queue) => `Volume: \`${queue.volume}\` | Filter: \`${queue.filter || "OFF"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
//distube
distube
     .on("playSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Playing new song", `Song: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\n**💡 Requested by:** ${song.user}\n${status(queue)}`)
     })
     .on("addSong", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Added a Song", `Song: \`${song.name}\`  -  \`${song.formattedDuration}\` \n\nRequested by: ${song.user}`)
     })
     .on("playList", (message, queue, playlist, song) => {
        embedbuilder(client, message, "GREEN", "Playling playlist", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items} songs\` \n\nRequested by: ${song.user}\n\nstarting playing Song: \`${song.name}\`  -  \`${song.formattedDuration}\`\n${status(queue)}`)
     })
     .on("addList", (message, queue, song) => {
        embedbuilder(client, message, "GREEN", "Added a Playling!", `Playlist: \`${playlist.title}\`  -  \`${playlist.total_items} songs\` \n\nRequested by: ${song.user}`)
     })
     .on("searchResult", (message, result) => {
        let i = 0;
        embedbuilder(client, message, "YELLOW", "", `**Choose an option from below**\n${result.map(song => `**${++i}**. \`\`\`${song.name} - ${song.formattedDuration}\`\`\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
      })
     // DisTubeOptions.searchSongs = true
     .on("searchCancel", (message) =>  embedbuilder(client, message, "RED", `Searching canceled`, "")
     )
     .on("error", (message, err) => embedbuilder(client, message, "RED", "An error occurred", err)
     )
     

//function embeds
//embedbuilder(client, message, "RED", "TITEL", "DESCRIPTION")
function embedbuilder(client, message, color, title, description){
    let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setFooter(client.user.username, client.user.displayAvatarURL());
    if(title) embed.setTitle(title);
    if(description) embed.setDescription(description);
    return message.channel.send(embed);
}

keepAlive();