
---

### **2. 📄 src/proxyManager.js**
```javascript
// ============================================
// 🔥 PROXY MANAGER - KELOLA PROXY 🔥
// ============================================

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ProxyManager {
    constructor(proxyFile = './proxy.txt') {
        this.proxyFile = proxyFile;
        this.proxies = [];
        this.currentIndex = 0;
    }

    // LOAD PROXY DARI FILE
    loadFromFile() {
        try {
            if (fs.existsSync(this.proxyFile)) {
                const data = fs.readFileSync(this.proxyFile, 'utf8');
                const lines = data.split('\n');
                
                this.proxies = [];
                for (const line of lines) {
                    const proxy = line.trim();
                    if (proxy && !proxy.startsWith('#')) {
                        this.proxies.push(proxy);
                    }
                }
                
                console.log(`[✓] Loaded ${this.proxies.length} proxies from file`);
                return this.proxies;
            } else {
                console.log('[!] Proxy file not found');
                return [];
            }
        } catch (err) {
            console.log(`[!] Error loading proxies: ${err.message}`);
            return [];
        }
    }

    // FETCH PROXY DARI INTERNET
    async fetchFromInternet() {
        const sources = [
            'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
            'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
            'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt'
        ];

        let newProxies = [];
        
        for (const source of sources) {
            try {
                console.log(`[*] Fetching from ${source}...`);
                const response = await axios.get(source, { timeout: 5000 });
                const lines = response.data.split('\n');
                
                for (const line of lines) {
                    const proxy = line.trim();
                    if (proxy && proxy.includes(':')) {
                        newProxies.push(proxy);
                    }
                }
                
                console.log(`[+] Got ${lines.length} proxies from source`);
            } catch (err) {
                console.log(`[!] Failed to fetch from ${source}`);
            }
        }

        // Remove duplicates
        this.proxies = [...new Set([...this.proxies, ...newProxies])];
        
        // Save to file
        this.saveToFile();
        
        return this.proxies;
    }

    // SAVE PROXY KE FILE
    saveToFile() {
        try {
            const data = this.proxies.join('\n');
            fs.writeFileSync(this.proxyFile, data);
            console.log(`[✓] Saved ${this.proxies.length} proxies to file`);
        } catch (err) {
            console.log(`[!] Error saving proxies: ${err.message}`);
        }
    }

    // GET RANDOM PROXY
    getRandomProxy() {
        if (this.proxies.length === 0) return null;
        return this.proxies[Math.floor(Math.random() * this.proxies.length)];
    }

    // GET NEXT PROXY (ROUND ROBIN)
    getNextProxy() {
        if (this.proxies.length === 0) return null;
        const proxy = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        return proxy;
    }

    // TEST PROXY
    async testProxy(proxy) {
        try {
            const start = Date.now();
            await axios.get('http://httpbin.org/ip', {
                proxy: {
                    host: proxy.split(':')[0],
                    port: parseInt(proxy.split(':')[1])
                },
                timeout: 5000
            });
            const ms = Date.now() - start;
            return { working: true, ms };
        } catch (err) {
            return { working: false };
        }
    }

    // TEST ALL PROXIES
    async testAllProxies() {
        console.log('[*] Testing proxies...');
        const working = [];
        
        for (const proxy of this.proxies) {
            const result = await this.testProxy(proxy);
            if (result.working) {
                working.push(proxy);
                console.log(`[✓] ${proxy} - ${result.ms}ms`);
            } else {
                console.log(`[✗] ${proxy} - failed`);
            }
        }
        
        this.proxies = working;
        this.saveToFile();
        
        return working;
    }

    // GET PROXY COUNT
    count() {
        return this.proxies.length;
    }

    // ADD PROXY
    addProxy(proxy) {
        this.proxies.push(proxy);
        this.saveToFile();
    }

    // REMOVE PROXY
    removeProxy(proxy) {
        this.proxies = this.proxies.filter(p => p !== proxy);
        this.saveToFile();
    }

    // CLEAR ALL PROXIES
    clear() {
        this.proxies = [];
        this.saveToFile();
    }
}

module.exports = ProxyManager;
