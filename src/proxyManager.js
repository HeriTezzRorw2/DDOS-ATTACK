
// ============================================
// 🔥 PROXY MANAGER - AMBIL DAN LOAD PROXY 🔥
// ============================================

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ProxyManager {
    constructor() {
        this.proxies = [];
        this.proxyFile = path.join(__dirname, '..', 'proxy.txt');
    }

    async loadProxies() {
        // LOAD DARI FILE
        try {
            if (fs.existsSync(this.proxyFile)) {
                const data = fs.readFileSync(this.proxyFile, 'utf8');
                this.proxies = data.split('\n')
                    .filter(line => line && !line.startsWith('#'))
                    .map(line => line.trim());
            }
        } catch (err) {
            console.log('Error loading proxies:', err.message);
        }

        // KALO KOSONG, FETCH DARI INTERNET
        if (this.proxies.length === 0) {
            await this.fetchProxies();
        }

        return this.proxies;
    }

    async fetchProxies() {
        const sources = [
            'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
            'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt'
        ];

        for (const source of sources) {
            try {
                const response = await axios.get(source, { timeout: 5000 });
                const lines = response.data.split('\n');
                
                for (const line of lines) {
                    const proxy = line.trim();
                    if (proxy && proxy.includes(':')) {
                        this.proxies.push(proxy);
                    }
                }
                
                // SAVE KE FILE
                fs.writeFileSync(this.proxyFile, this.proxies.join('\n'));
                break;
            } catch (err) {
                console.log(`Failed to fetch from ${source}`);
            }
        }
    }
}

module.exports = ProxyManager;
