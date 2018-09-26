const config = require("./Settings/config.json");
const repo = require("./Repo/Repository.js");

const OS = require('os');
const Discord = require("discord.js");
const client = new Discord.Client();

function print(message) {
    console.log(message);
}

var admins = [];

async function SendToAdmin(message) {
    if (admins == undefined) {
        admins = await GetAdmins();
    }
    admins.forEach(function (admin) {
        admin.send(message);
    });
}

function initialize_misc() {

    client.on('ready', async () => {
        var owners = await repo.GetAllOwners();
        for (var i = 0; i < owners.length; i++) {
            try {
                var x = await client.fetchUser(owners[i].toString());
                admins.push(x);
                print("found and pushed " + owners[i]);
            }
            catch (err) {
                print("couldn't find: " + owners[i] + " - " + err.message);
            }
        }


        print(`Logged in as ${client.user.tag}!`, true);
        
        for (var i = 0; i < admins.length; i++) {
            try {
                admins[i].send("Hi, this is the developer of Wora speaking (<@124928188647211009>). \n \n A few months ago WIJ has gone on hiatus. We decides to keep Wora online for an uncertain amount of time. \n In the meantime months before this decision was made I had already left WIJ (and roblox) to focus on everything else. I did continue the maintenance on WORA and up until 2 days ago I was working on version 1.3 (which included a redesign of the horrible usability of Wora). (if you want it an unfinished version it is on github) \n Anyway lets just get straight to the point **Wora is shutting down within the next week**. \n\n The server that Wora runs on is gonna shutdown soon due to recent decisions made by us. \n \n BUT GOOD NEWS! I do have an replacement for you. You can change the `http://wijalliance.info:3000` to `https://https://discord.osyr.is/api/webhooks/` for your webhooks to keep functioning. This has been made by another roblox developer that does the same thing as wora does but simpler as it doesnt require setup in discord. \n https://devforum.roblox.com/t/discord-integration-a-guide-on-using-discord-through-roblox-updated/47090?page=4 \n \n So yeah, thats it. It was fun but yeah. For questions you can contact me (<@124928188647211009>) but otherwise. It was a good run.\n\n Have a nice day. \n\n ~Wora \n ~Enes");
                admins[i].send("If you have recieved multiple messages, I sincerely apologize.");
                print("SUCCESFULLY SENT TO " + admins[i].tag);
            }
            catch (err) {
                print("FAILED TO SEND TO " + admins[i].tag);
            }
        };
    });

    client.on('guildCreate', async guild => {
        SendToAdmin(`Connected to a discord: ${guild.name} - ${guild.memberCount} members`);
    });

    client.on('guildDelete', async guild => {
        SendToAdmin(`Disconnected from a discord: ${guild.name} - ${guild.memberCount} members`);
    });
}

async function Start_Bot() {
    await initialize_misc();
    await client.login(config.token.discord);
    print("Bot has started", true);


}

Start_Bot();





