const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys');
const fs = require('fs');
const path = require('path');

// Bot info
const BOT_OWNER = "EVIL EURO"; // Owner name
const BOT_VERSION = "5.2.5";
const PREFIX = ".";

// Auth
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// Initialize WhatsApp connection
const conn = makeWASocket({
    auth: state,
    printQRInTerminal: false // NO QR, using pairing code
});

// Save auth updates
conn.ev.on('creds.update', saveState);

// Load commands from ./commands folder
const commands = {};
const commandFolders = fs.readdirSync('./commands').filter(f => fs.statSync(`./commands/${f}`).isDirectory());

for (const folder of commandFolders) {
    const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const cmd = require(`./commands/${folder}/${file}`);
        if(cmd.name) {
            commands[cmd.name.toLowerCase()] = cmd; // ensure lowercase for command matching
        }
    }
}

// Message handler
conn.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message) return;
    const sender = msg.key.remoteJid;

    // Get message text
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text || !text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    // Execute command if exists
    if (commands[cmdName]) {
        try {
            await commands[cmdName].execute(conn, msg, args);
        } catch (err) {
            console.error(`Error executing command ${cmdName}:`, err);
        }
    }
});

// Connection status handler
conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode;
        if(reason !== DisconnectReason.loggedOut) {
            console.log('Reconnecting...');
            conn.connect(); // Reconnect automatically if not logged out
        } else {
            console.log('Connection closed. You need to re-pair the bot.');
        }
    } else if(connection === 'open') {
        console.log(`Bot connected as ${BOT_OWNER} - Version ${BOT_VERSION}`);
    }
});

console.log(`Bot is running! Prefix: ${PREFIX}`);

// Categories reference (commands should be in ./commands/<category>/)
console.log(`
Commands loaded:
- AI
- AUDIO
- AUTOREPLY
- BOT
- BUDGET
- DOCUMENT
- DOWNLOAD
- EDITOR
- GAME
- GROUP
- LOGIA
- MISC
- PERSONAL
- PLUGIN
- SCHEDULE
- SEARCH
- STICKER
- TEXTMAKER
- USER
- VARS
- VIDEO
- WHATSAPP
`);
