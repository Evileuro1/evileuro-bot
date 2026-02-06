const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

// Bot info
const ownerName = "EVIL EURO";
const botVersion = "5.2.5";

// Initialize connection
const conn = new WAConnection();
conn.version = [2, 2204, 13];
conn.logger.level = 'warn';

// Show pairing code (instead of QR)
conn.on('qr', qr => {
    console.log('=== PAIRING CODE ===');
    console.log(qr); // Share this code to pair device
    qrcode.generate(qr, { small: true });
});

// When bot connects
conn.on('open', () => {
    console.log(`✅ Bot is online!`);
    console.log(`Owner: ${ownerName}`);
    console.log(`Version: ${botVersion}`);
});

// Commands list
const commands = {
    ai: ['BING','DALL','GEMINI','GPT','GROQ','UPSCALE'],
    audio: ['AVEC','BASS','BLACK','BLOWN','CUT','DEEP','EARRAPE','FAST','FAT','HISTO','LOW','NIGHTCORE','PITCH','ROBOT','SLOW','SMOOTH','TREBLE','TUPAI','VECTOR'],
    autoreply: ['FILTER','GFILTER','GSTOP','PFILTER','PSTOP','STOP'],
    bot: ['BACKUP','GAUTH','GUPLOAD','REMINDER','TOG','UPDATE','UPDATE NOW'],
    budget: ['DELBUDGET','EXPENSE','INCOME','SUMMARY'],
    document: ['PAGE','PDF'],
    download: ['APK','FB','FULLSS','INSTA','MEDIAFIRE','PINTEREST','PLAY','REDDIT','SONG','SPOTIFY','SS','STORY','TIKTOK','TWITTER','UPLOAD','VIDEO','YTA','YTV'],
    editor: ['BLOODY','BOKEH','CARTOON','COLOR','DARK','DEMON','ENHANCE','GANDM','HORNED','KISS','LOOK','MAKEUP','PENCIL','SKETCH','SKULL','WANTED','ZOMBIE'],
    game: ['TICTACTOE','WCG','WRG'],
    group: ['ADD','AMUTE','ANTIFAKE','ANTIGM','ANTILINK','ANTISPAM','ANTIWORD','AUNMUTE','COMMON','DEMOTE','GINF0','GOODBYE','GPP','GSTATUS','INACTIVE','INVITE','JOIN','KICK','MSGS','MUTE','PDM','PROMOTE','RESET','REVOKE','TAG','UNMUTE','VOTE','WARN','WELCOME'],
    logia: ['OPE','YAMI','ZUSHI'],
    misc: ['AFK','ALIVE','AVM','CALC','CREACT','DELCMD','FANCY','FORWARD','GETCMD','LYDIA','MENTION','MFORWARD','NEWS','PING','QR','REACT','REBOOT','RMBG','SAVE','SETCMD','TTS','URL','WHOIS'],
    personal: ['DELGREET','GETGREET','SETGREET'],
    plugin: ['PLUGIN','REMOVE'],
    schedule: ['DELSCHEDULE','GETSCHEDULE','SETSCHEDULE'],
    search: ['EMIX','EMOJI','FIND','IG','IMG','ISON','JEAN','MOVIE','TIME','TRT','WEATHER','YTS'],
    sticker: ['CIRCLE','EXIF','MP4','PHOTO','STICKER','TAKE','TG'],
    textmaker: ['3D','ANGEL','AVENGER','BLUB','BPINK','CAT','GLITCH','GLITTER','GRAFFITI','HACKER','LIGHT','MARVEL','NEON','SCI','SIGN','TATTOO','WATERCOLOR'],
    user: ['BLOCK','FULLPP','GJID','JID','LEFT','PP','UNBLOCK'],
    vars: ['ALLVAR','DELSUDO','DELVAR','GETSUDO','GETVAR','SETSUDO','SETVAR'],
    video: ['COMPRESS','CROP','MERGE','MP3','REVERSE','ROTATE','TRIM'],
    whatsapp: ['CALL','CAPTION','CLEAR','DELETE','DLT','DOC','ONLINE','POLL','READ','SCSTATUS','SETSTATUS','STATUS','VV']
};

// Listen for messages
conn.on('chat-update', async chatUpdate => {
    if (!chatUpdate.hasNewMessage) return;
    const message = chatUpdate.messages.all()[0];
    if (!message.message) return;

    const sender = message.key.remoteJid;
    const msg = message.message.conversation || '';

    const cmd = msg.trim().split(' ')[0].toUpperCase();
    let found = false;

    for (let category in commands) {
        if (commands[category].includes(cmd)) {
            found = true;
            await conn.sendMessage(sender, `✅ Command "${cmd}" recognized in category "${category}".`, MessageType.text);
            break;
        }
    }

    if (!found && msg.startsWith('.')) {
        await conn.sendMessage(sender, `❌ Command "${cmd}" not found.`, MessageType.text);
    }
});

// Start bot
async function startBot() {
    await conn.connect({ timeoutMs: 30 * 1000 });
}
startBot();
